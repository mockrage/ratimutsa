import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Enum value types (kept as plain strings for SQLite compatibility)
type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'SUBMIT';

// ===== PRODUCT VARIANT SERVICE (Task 3.1) =====

export async function createVariant(data: {
  productId: string;
  name: string;
  sku: string;
  b2cPrice: number;
  b2bPrice: number;
  inventory: number;
  minOrderQtyB2C?: number;
  minOrderQtyB2B?: number;
  unit: string;
}) {
  // Validate B2B price <= B2C price
  if (data.b2bPrice > data.b2cPrice) {
    throw new Error('B2B price must be less than or equal to B2C price');
  }

  // Check SKU uniqueness
  const existingSku = await prisma.productVariant.findUnique({ where: { sku: data.sku } });
  if (existingSku) {
    throw new Error('SKU already exists');
  }

  return prisma.productVariant.create({
    data: {
      productId: data.productId,
      name: data.name,
      sku: data.sku,
      b2cPrice: data.b2cPrice,
      b2bPrice: data.b2bPrice,
      inventory: data.inventory,
      minOrderQtyB2C: data.minOrderQtyB2C || 1,
      minOrderQtyB2B: data.minOrderQtyB2B || 1,
      unit: data.unit,
    },
  });
}

export async function updateVariant(id: string, data: Partial<{
  name: string;
  b2cPrice: number;
  b2bPrice: number;
  inventory: number;
  minOrderQtyB2C: number;
  minOrderQtyB2B: number;
  unit: string;
}>) {
  if (data.b2bPrice !== undefined && data.b2cPrice !== undefined && data.b2bPrice > data.b2cPrice) {
    throw new Error('B2B price must be less than or equal to B2C price');
  }

  return prisma.productVariant.update({
    where: { id },
    data,
  });
}

export async function deleteVariant(id: string) {
  return prisma.productVariant.delete({ where: { id } });
}

export async function getVariantsByProduct(productId: string) {
  return prisma.productVariant.findMany({
    where: { productId },
    orderBy: { b2cPrice: 'asc' },
  });
}

export async function getVariantBySku(sku: string) {
  return prisma.productVariant.findUnique({ where: { sku } });
}

// ===== APPROVAL SERVICE (Task 4.1) =====

export async function submitForApproval(productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error('Product not found');
  if (product.workflowState !== 'DRAFT' && product.workflowState !== 'REJECTED') {
    throw new Error('Product can only be submitted from DRAFT or REJECTED state');
  }

  return prisma.product.update({
    where: { id: productId },
    data: { workflowState: 'PENDING_APPROVAL', rejectionNotes: null },
  });
}

export async function approveProduct(productId: string, adminId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error('Product not found');
  if (product.workflowState !== 'PENDING_APPROVAL') {
    throw new Error('Product must be in PENDING_APPROVAL state');
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { workflowState: 'PUBLISHED', isAvailable: true },
  });

  // Log audit
  await logAction(adminId, 'Product', productId, 'APPROVE', {
    before: { workflowState: 'PENDING_APPROVAL' },
    after: { workflowState: 'PUBLISHED' },
  });

  return updated;
}

export async function rejectProduct(productId: string, adminId: string, notes: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error('Product not found');
  if (product.workflowState !== 'PENDING_APPROVAL') {
    throw new Error('Product must be in PENDING_APPROVAL state');
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { workflowState: 'REJECTED', rejectionNotes: notes },
  });

  await logAction(adminId, 'Product', productId, 'REJECT', {
    before: { workflowState: 'PENDING_APPROVAL' },
    after: { workflowState: 'REJECTED', rejectionNotes: notes },
  });

  return updated;
}

export async function detectDuplicates(name: string, excludeId?: string) {
  const products = await prisma.product.findMany({
    where: {
      name: { contains: name },
      ...(excludeId && { id: { not: excludeId } }),
    },
    take: 5,
  });
  return products;
}

// ===== INVENTORY SERVICE (Task 5.1) =====

export async function getInventoryStatus(variantId: string) {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: {
      reservations: {
        where: { expiresAt: { gt: new Date() } },
      },
    },
  });

  if (!variant) throw new Error('Variant not found');

  const reserved = variant.reservations.reduce((sum, r) => sum + r.quantity, 0);
  return {
    total: variant.inventory,
    reserved,
    available: variant.inventory - reserved,
    lowStock: variant.inventory - reserved <= 10,
  };
}

export async function updateInventory(variantId: string, quantity: number, adminId: string, reason: string) {
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) throw new Error('Variant not found');

  const updated = await prisma.productVariant.update({
    where: { id: variantId },
    data: { inventory: quantity },
  });

  await logAction(adminId, 'ProductVariant', variantId, 'UPDATE', {
    before: { inventory: variant.inventory },
    after: { inventory: quantity },
    reason,
  });

  // Check for low stock notification
  if (quantity <= 10) {
    await createNotification(
      'LOW_STOCK',
      `Low stock alert: ${variant.name} has only ${quantity} units remaining`,
      { variantId, variantName: variant.name, quantity }
    );
  }

  // Trigger pre-order fulfillment if inventory was replenished
  if (quantity > variant.inventory) {
    await fulfillPreOrders(variantId);
  }

  return updated;
}

export async function reserveInventory(variantId: string, quantity: number, customerEmail: string, type: 'B2B_CART' | 'ORDER_PAID') {
  const status = await getInventoryStatus(variantId);
  if (status.available < quantity) {
    throw new Error(`Insufficient inventory. Only ${status.available} available.`);
  }

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + (type === 'B2B_CART' ? 48 : 168)); // 48h for B2B cart, 7 days for paid orders

  return prisma.inventoryReservation.create({
    data: {
      variantId,
      quantity,
      customerEmail,
      type,
      expiresAt,
    },
  });
}

export async function releaseReservation(reservationId: string) {
  return prisma.inventoryReservation.delete({ where: { id: reservationId } });
}

export async function cleanupExpiredReservations() {
  return prisma.inventoryReservation.deleteMany({
    where: { expiresAt: { lte: new Date() } },
  });
}

// ===== PRE-ORDER SERVICE (Task 6.1) =====

export async function createPreOrder(data: {
  variantId: string;
  customerEmail: string;
  customerName: string;
  quantity: number;
}) {
  const lastPreOrder = await prisma.preOrder.findFirst({
    where: { variantId: data.variantId, status: 'QUEUED' },
    orderBy: { queuePosition: 'desc' },
  });

  const queuePosition = (lastPreOrder?.queuePosition || 0) + 1;

  return prisma.preOrder.create({
    data: {
      ...data,
      queuePosition,
      status: 'QUEUED',
    },
  });
}

export async function fulfillPreOrders(variantId: string) {
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) return;

  const queuedPreOrders = await prisma.preOrder.findMany({
    where: { variantId, status: 'QUEUED' },
    orderBy: { queuePosition: 'asc' },
  });

  let availableInventory = variant.inventory;

  for (const preOrder of queuedPreOrders) {
    if (availableInventory >= preOrder.quantity) {
      await prisma.preOrder.update({
        where: { id: preOrder.id },
        data: { status: 'FULFILLED', fulfilledAt: new Date() },
      });

      await createNotification(
        'PREORDER_FULFILLED',
        `Pre-order fulfilled for ${preOrder.customerName}: ${variant.name}`,
        { preOrderId: preOrder.id, customerEmail: preOrder.customerEmail }
      );

      availableInventory -= preOrder.quantity;
    } else {
      break; // FIFO - stop when we can't fulfill the next one
    }
  }
}

export async function cancelPreOrder(preOrderId: string) {
  return prisma.preOrder.update({
    where: { id: preOrderId },
    data: { status: 'CANCELLED' },
  });
}

export async function getPreOrderQueue(variantId: string) {
  return prisma.preOrder.findMany({
    where: { variantId, status: 'QUEUED' },
    orderBy: { queuePosition: 'asc' },
  });
}

// ===== AUDIT SERVICE (Task 8.1) =====

export async function logAction(
  adminId: string,
  entityType: string,
  entityId: string,
  action: AuditAction,
  changes: any
) {
  return prisma.auditLog.create({
    data: {
      adminId,
      entityType,
      entityId,
      action,
      changes: JSON.stringify(changes),
    },
  });
}

export async function getAuditLog(filters?: {
  adminId?: string;
  entityType?: string;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  const where: any = {};
  
  if (filters?.adminId) where.adminId = filters.adminId;
  if (filters?.entityType) where.entityType = filters.entityType;
  if (filters?.action) where.action = filters.action;
  if (filters?.startDate || filters?.endDate) {
    where.timestamp = {};
    if (filters.startDate) where.timestamp.gte = filters.startDate;
    if (filters.endDate) where.timestamp.lte = filters.endDate;
  }

  return prisma.auditLog.findMany({
    where,
    include: { admin: { select: { name: true, email: true } } },
    orderBy: { timestamp: 'desc' },
    take: filters?.limit || 50,
    skip: filters?.offset || 0,
  });
}

// ===== NOTIFICATION SERVICE (Task 16.1) =====

export async function createNotification(
  type: 'APPROVAL_REQUIRED' | 'LOW_STOCK' | 'CONCURRENT_EDIT' | 'PREORDER_FULFILLED',
  message: string,
  metadata?: any,
  adminId?: string
) {
  return prisma.adminNotification.create({
    data: {
      type,
      message,
      metadata: metadata ? JSON.stringify(metadata) : null,
      adminId: adminId || null,
    },
  });
}

export async function getNotifications(adminId?: string, limit = 20) {
  return prisma.adminNotification.findMany({
    where: adminId ? { OR: [{ adminId }, { adminId: null }] } : {},
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function markNotificationAsRead(notificationId: string) {
  return prisma.adminNotification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

export async function getUnreadCount(adminId?: string) {
  return prisma.adminNotification.count({
    where: {
      isRead: false,
      ...(adminId ? { OR: [{ adminId }, { adminId: null }] } : {}),
    },
  });
}

export async function cleanupOldNotifications() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return prisma.adminNotification.deleteMany({
    where: { createdAt: { lte: thirtyDaysAgo } },
  });
}

// ===== ANALYTICS SERVICE (Task 15.1) =====

const analyticsCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key: string) {
  const cached = analyticsCache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }
  analyticsCache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  analyticsCache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

export async function calculateRevenue(startDate?: Date, endDate?: Date) {
  const cacheKey = `revenue_${startDate?.toISOString()}_${endDate?.toISOString()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const where: any = {};
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  const orders = await prisma.orderRequest.findMany({
    where: { ...where, status: { not: 'CANCELLED' } },
    include: { items: { include: { product: true } } },
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const productBreakdown: Record<string, number> = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      const name = item.product?.name || 'Unknown';
      productBreakdown[name] = (productBreakdown[name] || 0) + (item.price * item.quantity);
    });
  });

  const result = { totalRevenue, orderCount: orders.length, productBreakdown };
  setCache(cacheKey, result);
  return result;
}

export async function calculateOrderVolume(period: 'daily' | 'weekly' | 'monthly' = 'monthly') {
  const orders = await prisma.orderRequest.findMany({
    where: { status: { not: 'CANCELLED' } },
    orderBy: { createdAt: 'asc' },
    take: 1000,
  });

  return orders.reduce((acc: Record<string, number>, order) => {
    let key: string;
    const date = new Date(order.createdAt);
    
    if (period === 'daily') {
      key = date.toISOString().split('T')[0];
    } else if (period === 'weekly') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split('T')[0];
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export async function calculateCustomerDemographics() {
  const [b2cCount, b2bCount] = await Promise.all([
    prisma.orderRequest.count({ where: { customerType: 'B2C' } }),
    prisma.orderRequest.count({ where: { customerType: 'B2B' } }),
  ]);

  return { b2c: b2cCount, b2b: b2bCount, total: b2cCount + b2bCount };
}

export async function calculateInventoryTurnover() {
  const variants = await prisma.productVariant.findMany({
    include: {
      product: true,
      orderItems: true,
    },
  });

  return variants.map(variant => ({
    variantId: variant.id,
    variantName: variant.name,
    productName: variant.product.name,
    currentInventory: variant.inventory,
    totalOrdered: variant.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    turnoverRate: variant.inventory > 0
      ? variant.orderItems.reduce((sum, item) => sum + item.quantity, 0) / variant.inventory
      : 0,
  }));
}

// ===== CONCURRENT EDIT SERVICE (Task 9.1) =====

const editSessions = new Map<string, { adminId: string; adminName: string; startedAt: Date }>();

export function startEditSession(entityType: string, entityId: string, adminId: string, adminName: string) {
  const key = `${entityType}:${entityId}`;
  const existing = editSessions.get(key);
  
  if (existing && existing.adminId !== adminId) {
    return { conflict: true, currentEditor: existing.adminName, startedAt: existing.startedAt };
  }

  editSessions.set(key, { adminId, adminName, startedAt: new Date() });
  return { conflict: false };
}

export function endEditSession(entityType: string, entityId: string) {
  editSessions.delete(`${entityType}:${entityId}`);
}

export function getActiveEditor(entityType: string, entityId: string) {
  return editSessions.get(`${entityType}:${entityId}`) || null;
}

// ===== RESERVATION SERVICE (Task 12.1) =====

export async function createB2BReservation(data: {
  variantId: string;
  quantity: number;
  customerEmail: string;
}) {
  return reserveInventory(data.variantId, data.quantity, data.customerEmail, 'B2B_CART');
}

export async function convertReservationToOrder(reservationId: string) {
  const reservation = await prisma.inventoryReservation.findUnique({ where: { id: reservationId } });
  if (!reservation) throw new Error('Reservation not found');

  await prisma.inventoryReservation.update({
    where: { id: reservationId },
    data: { type: 'ORDER_PAID' },
  });

  return reservation;
}

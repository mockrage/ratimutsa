'use client';

export type CustomerType = 'B2C' | 'B2B';

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  price: number;
  b2bPrice?: number;
  quantity: number;
  unit: string;
  imageUrl: string;
  minOrderQty?: number;
}

export function getCustomerType(): CustomerType {
  if (typeof window === 'undefined') return 'B2C';
  return (localStorage.getItem('customerType') as CustomerType) || 'B2C';
}

export function setCustomerType(type: CustomerType) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('customerType', type);
  window.dispatchEvent(new Event('cartUpdated'));
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const key = item.variantId || item.productId;
  const existingIndex = cart.findIndex(i => (i.variantId || i.productId) === key);
  
  // Minimum order quantity validation
  if (item.minOrderQty && item.quantity < item.minOrderQty) {
    throw new Error(`Minimum order quantity is ${item.minOrderQty}`);
  }

  if (existingIndex > -1) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
}

export function removeFromCart(productId: string) {
  const cart = getCart();
  const filtered = cart.filter(i => (i.variantId || i.productId) !== productId);
  localStorage.setItem('cart', JSON.stringify(filtered));
  window.dispatchEvent(new Event('cartUpdated'));
}

export function updateCartQuantity(productId: string, quantity: number) {
  const cart = getCart();
  const item = cart.find(i => (i.variantId || i.productId) === productId);
  if (item) {
    // Validate minimum order quantity
    if (item.minOrderQty && quantity < item.minOrderQty) {
      return; // Silently refuse
    }
    item.quantity = quantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  }
}

export function clearCart() {
  localStorage.removeItem('cart');
  window.dispatchEvent(new Event('cartUpdated'));
}

export function getCartTotal(): number {
  const cart = getCart();
  const customerType = getCustomerType();
  return cart.reduce((total, item) => {
    const price = customerType === 'B2B' && item.b2bPrice ? item.b2bPrice : item.price;
    return total + (price * item.quantity);
  }, 0);
}

export function getCartCount(): number {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

export function validateMinimumQuantities(): { valid: boolean; errors: string[] } {
  const cart = getCart();
  const errors: string[] = [];
  
  cart.forEach(item => {
    if (item.minOrderQty && item.quantity < item.minOrderQty) {
      errors.push(`${item.name}: Minimum order is ${item.minOrderQty} ${item.unit}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

'use client';

import { useState, useMemo } from 'react';
import OrderStatusButton from './OrderStatusButton';
import OrderFiltersComponent, { OrderFilters } from './OrderFilters';
import { Download } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  } | null;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  customerType: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrdersClientProps {
  orders: Order[];
}

export default function OrdersClient({ orders }: OrdersClientProps) {
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: '',
    customerType: '',
    startDate: '',
    endDate: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20;

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          order.customerName.toLowerCase().includes(searchLower) ||
          order.customerPhone.includes(searchLower) ||
          order.id.toLowerCase().includes(searchLower) ||
          (order.customerEmail && order.customerEmail.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && order.status !== filters.status) {
        return false;
      }

      // Customer type filter
      if (filters.customerType && order.customerType !== filters.customerType) {
        return false;
      }

      // Date range filter
      const orderDate = new Date(order.createdAt);
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (orderDate < startDate) return false;
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (orderDate > endDate) return false;
      }

      return true;
    });
  }, [orders, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      status: '',
      customerType: '',
      startDate: '',
      endDate: '',
    });
    setCurrentPage(1);
  };

  // Export to CSV
  const handleExport = () => {
    const csvHeaders = ['Order ID', 'Customer Name', 'Phone', 'Email', 'Type', 'Status', 'Total', 'Date', 'Items'];
    const csvRows = filteredOrders.map(order => [
      order.id,
      order.customerName,
      order.customerPhone,
      order.customerEmail || '',
      order.customerType,
      order.status,
      order.totalAmount.toFixed(2),
      new Date(order.createdAt).toLocaleString(),
      order.items.map(item => `${item.product?.name || 'Unknown'} (${item.quantity})`).join('; '),
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxury-charcoal">Order Requests</h1>
          <p className="text-sm text-gray-500 font-light mt-1">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
          </p>
        </div>
        <button
          onClick={handleExport}
          className="btn-outline inline-flex items-center gap-2 text-xs"
          disabled={filteredOrders.length === 0}
        >
          <Download className="w-4 h-4" strokeWidth={1.5} />
          Export CSV
        </button>
      </div>

      <OrderFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
      />

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6">Order ID</th>
                <th className="text-left py-4 px-6">Customer</th>
                <th className="text-left py-4 px-6">Contact</th>
                <th className="text-left py-4 px-6">Items</th>
                <th className="text-left py-4 px-6">Total</th>
                <th className="text-left py-4 px-6">Status</th>
                <th className="text-left py-4 px-6">Date</th>
                <th className="text-left py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 font-light">
                    No orders found matching your filters
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-mono text-sm">{order.id.slice(0, 8)}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold">{order.customerName}</p>
                        {order.customerEmail && (
                          <p className="text-sm text-gray-600">{order.customerEmail}</p>
                        )}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          order.customerType === 'B2B' ? 'bg-luxury-windsor-oak/10 text-luxury-windsor-oak' : 'bg-luxury-forest-green/10 text-luxury-forest-green'
                        }`}>
                          {order.customerType}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline">
                        {order.customerPhone}
                      </a>
                    </td>
                    <td className="py-4 px-6">
                      <details className="cursor-pointer">
                        <summary className="font-semibold">{order.items.length} items</summary>
                        <ul className="mt-2 text-sm text-gray-600">
                          {order.items.map((item) => (
                            <li key={item.id}>
                              {item.product?.name || 'Unknown Product'} × {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </td>
                    <td className="py-4 px-6 font-semibold">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <OrderStatusButton orderId={order.id} currentStatus={order.status} />
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-outline text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded text-xs font-sans font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-luxury-forest-green text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn-outline text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

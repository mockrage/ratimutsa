'use client';

import { useState } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, XCircle, Phone } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string;
  } | null;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  customerType: string;
  deliveryOption: string;
  deliveryAddress: string | null;
  status: string;
  totalAmount: number;
  deliveryFee: number;
  createdAt: string;
  items: OrderItem[];
}

export default function TrackOrderClient() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(`/api/orders/track?orderId=${orderId}&phone=${encodeURIComponent(phone)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found. Please check your order ID and phone number.');
        }
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-6 h-6 text-amber-600" strokeWidth={1.5} />;
      case 'CONFIRMED':
        return <CheckCircle2 className="w-6 h-6 text-blue-600" strokeWidth={1.5} />;
      case 'PROCESSING':
        return <Package className="w-6 h-6 text-purple-600" strokeWidth={1.5} />;
      case 'DELIVERED':
        return <Truck className="w-6 h-6 text-luxury-forest-green" strokeWidth={1.5} />;
      case 'CANCELLED':
        return <XCircle className="w-6 h-6 text-red-600" strokeWidth={1.5} />;
      default:
        return <Package className="w-6 h-6 text-gray-600" strokeWidth={1.5} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'badge-yellow';
      case 'CONFIRMED':
        return 'badge-blue';
      case 'PROCESSING':
        return 'badge text-purple-700 bg-purple-50 border-purple-200';
      case 'DELIVERED':
        return 'badge-green';
      case 'CANCELLED':
        return 'badge-red';
      default:
        return 'badge';
    }
  };

  const statusSteps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED'];
  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Form */}
      <div className="card-luxury p-8 mb-8">
        <h2 className="text-2xl font-serif font-bold text-luxury-charcoal mb-2">
          Find Your Order
        </h2>
        <p className="text-sm text-gray-500 font-light mb-6">
          Enter your order ID and phone number to track your order status
        </p>

        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                Order ID *
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="input-field"
                placeholder="e.g., clx1a2b3c"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                placeholder="+1234567890"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full md:w-auto inline-flex items-center gap-2"
          >
            <Search className="w-4 h-4" strokeWidth={1.5} />
            {isLoading ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-sm text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Order Details */}
      {order && (
        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="card-luxury p-8">
            <h3 className="text-xl font-serif font-bold text-luxury-charcoal mb-6">
              Order Status
            </h3>

            {/* Status Steps */}
            {order.status !== 'CANCELLED' ? (
              <div className="flex items-center justify-between mb-8">
                {statusSteps.map((step, idx) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          idx <= currentStepIndex
                            ? 'bg-luxury-forest-green text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {idx < currentStepIndex ? (
                          <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
                        ) : (
                          getStatusIcon(step)
                        )}
                      </div>
                      <span
                        className={`text-xs font-sans mt-2 ${
                          idx <= currentStepIndex ? 'text-luxury-charcoal font-medium' : 'text-gray-400'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {idx < statusSteps.length - 1 && (
                      <div
                        className={`h-1 flex-1 transition-colors duration-300 ${
                          idx < currentStepIndex ? 'bg-luxury-forest-green' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-red-50 border border-red-200 rounded-sm mb-6">
                <div className="flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-red-600" strokeWidth={1.5} />
                  <div>
                    <h4 className="font-serif font-bold text-red-900">Order Cancelled</h4>
                    <p className="text-sm text-red-700 font-light mt-1">
                      This order has been cancelled. Please contact us if you have any questions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Current Status */}
            <div className="p-5 bg-luxury-cream rounded-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-sans tracking-wider uppercase mb-1">
                    Current Status
                  </p>
                  <span className={getStatusColor(order.status)}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-sans tracking-wider uppercase mb-1">
                    Order Date
                  </p>
                  <p className="text-sm font-sans font-medium text-luxury-charcoal">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="card-luxury p-8">
            <h3 className="text-xl font-serif font-bold text-luxury-charcoal mb-6">
              Order Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs text-gray-500 font-sans tracking-wider uppercase mb-2">
                  Order ID
                </p>
                <p className="font-mono text-sm text-luxury-charcoal">{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-sans tracking-wider uppercase mb-2">
                  Customer Type
                </p>
                <span className={order.customerType === 'B2B' ? 'badge-gold' : 'badge-green'}>
                  {order.customerType}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-sans tracking-wider uppercase mb-2">
                  Delivery Method
                </p>
                <p className="text-sm text-luxury-charcoal font-medium">
                  {order.deliveryOption === 'DELIVERY' ? 'Home Delivery' : 'CBD Pickup'}
                </p>
              </div>
              {order.deliveryAddress && (
                <div>
                  <p className="text-xs text-gray-500 font-sans tracking-wider uppercase mb-2">
                    Delivery Address
                  </p>
                  <p className="text-sm text-gray-600 font-light">{order.deliveryAddress}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-sm font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-4">
                Items Ordered
              </h4>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-sans font-medium text-sm text-luxury-charcoal">
                        {item.product?.name || 'Product'}
                      </p>
                      <p className="text-xs text-gray-400 font-light">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-serif font-semibold text-luxury-forest-green">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-100 pt-6 mt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-sans">${(order.totalAmount - order.deliveryFee).toFixed(2)}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span className="font-sans">${order.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="font-serif font-bold text-luxury-charcoal">Total</span>
                  <span className="text-xl font-serif font-bold text-luxury-forest-green">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="card-luxury p-6 bg-luxury-forest-green/5 border-luxury-forest-green/10">
            <h4 className="font-serif font-bold text-luxury-charcoal mb-2">
              Need Help?
            </h4>
            <p className="text-sm text-gray-600 font-light mb-4">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '263779527507'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxury bg-green-600 text-white border-green-600 hover:bg-transparent hover:text-green-600 text-xs inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp Us
              </a>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER || '+263 779 527 507'}`}
                className="btn-outline text-xs inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                Call Us
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

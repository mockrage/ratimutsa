'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ShieldCheck } from 'lucide-react';
import { getCart, removeFromCart, updateCartQuantity, getCartTotal, clearCart, CartItem } from '@/lib/cart';

type CustomerType = 'B2C' | 'B2B';

export default function CartClient() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerType, setCustomerType] = useState<CustomerType>('B2C');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCart(getCart());
    // Load saved customer type
    const savedType = localStorage.getItem('customerType') as CustomerType;
    if (savedType) setCustomerType(savedType);

    const handleCartUpdate = () => {
      setCart(getCart());
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleCustomerTypeChange = (type: CustomerType) => {
    setCustomerType(type);
    localStorage.setItem('customerType', type);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    router.push('/checkout');
  };

  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-luxury-forest-green/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-8 h-8 text-luxury-forest-green/40" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-luxury-charcoal mb-3">Your Order is Empty</h2>
        <p className="text-gray-500 font-light mb-8 max-w-md mx-auto">
          Explore our collection of premium farm products and add your favorites
        </p>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2">
        {/* Customer Type Selector */}
        <div className="card-luxury p-5 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-sans font-semibold tracking-wider uppercase text-luxury-charcoal">
                Customer Type
              </h3>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                B2B customers may receive special pricing
              </p>
            </div>
            <div className="flex bg-luxury-cream rounded-sm overflow-hidden border border-gray-200">
              <button
                onClick={() => handleCustomerTypeChange('B2C')}
                className={`px-5 py-2 text-xs font-sans font-medium transition-all duration-300 ${
                  customerType === 'B2C'
                    ? 'bg-luxury-forest-green text-white'
                    : 'text-gray-600 hover:text-luxury-forest-green'
                }`}
              >
                Individual (B2C)
              </button>
              <button
                onClick={() => handleCustomerTypeChange('B2B')}
                className={`px-5 py-2 text-xs font-sans font-medium transition-all duration-300 ${
                  customerType === 'B2B'
                    ? 'bg-luxury-forest-green text-white'
                    : 'text-gray-600 hover:text-luxury-forest-green'
                }`}
              >
                Business (B2B)
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-sm font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-6">
          Cart Items ({cart.length})
        </h2>
        
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.productId} className="card-luxury p-5">
              <div className="flex gap-5">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-sm overflow-hidden bg-gray-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-luxury-charcoal mb-1">{item.name}</h3>
                  <p className="text-sm text-luxury-forest-green font-serif font-semibold mb-3">
                    ${item.price.toFixed(2)} <span className="text-gray-400 font-sans font-normal text-xs">/ {item.unit}</span>
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="px-3 py-1.5 hover:bg-luxury-cream text-gray-500 transition-colors duration-200 text-sm"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                        className="w-14 text-center border-x border-gray-200 py-1.5 text-sm font-sans focus:outline-none"
                        min="1"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="px-3 py-1.5 hover:bg-luxury-cream text-gray-500 transition-colors duration-200 text-sm"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-red-400 hover:text-red-600 text-xs font-sans tracking-wider uppercase transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-serif font-bold text-luxury-forest-green">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="card-luxury p-6 sticky top-24">
          <h3 className="text-sm font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-6">
            Order Summary
          </h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-light">Subtotal</span>
              <span className="font-sans font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-light">Delivery</span>
              <span className="text-gray-400 font-light text-xs">Calculated at checkout</span>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span className="font-serif font-bold text-luxury-charcoal">Total</span>
                <span className="text-xl font-serif font-bold text-luxury-forest-green">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="btn-primary w-full mb-3"
          >
            {isLoading ? 'Processing...' : 'Proceed to Checkout'}
          </button>

          <Link href="/products" className="btn-outline w-full text-center block">
            Continue Ordering
          </Link>

          <div className="mt-6 p-4 bg-luxury-forest-green/5 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-luxury-forest-green" strokeWidth={1.5} />
              <span className="text-xs font-sans font-semibold text-luxury-charcoal">Freshness Guaranteed</span>
            </div>
            <p className="text-[11px] text-gray-500 font-light">
              All items will be harvested fresh for your order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

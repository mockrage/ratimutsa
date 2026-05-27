'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { addToCart } from '@/lib/cart';

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      unit: product.unit,
      imageUrl: product.imageUrl,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="space-y-5 mb-8">
      {/* Quantity Selector */}
      <div>
        <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2.5 hover:bg-luxury-cream text-gray-500 transition-colors duration-200 text-sm"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center border-x border-gray-200 py-2.5 text-sm font-sans focus:outline-none bg-white"
              min="1"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2.5 hover:bg-luxury-cream text-gray-500 transition-colors duration-200 text-sm"
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-400 font-sans">{product.unit}</span>
        </div>
      </div>

      {/* Line total */}
      <div className="flex items-center justify-between py-3 px-4 bg-luxury-cream rounded-sm">
        <span className="text-sm text-gray-500 font-light">Subtotal</span>
        <span className="text-lg font-serif font-bold text-luxury-forest-green">
          ${(product.price * quantity).toFixed(2)}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          className={`btn-primary flex-1 transition-all duration-300 ${
            isAdded ? 'bg-luxury-garden-lime border-luxury-garden-lime' : ''
          }`}
        >
          {isAdded ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4" strokeWidth={2} />
              Added to Cart
            </span>
          ) : (
            'Add to Cart'
          )}
        </button>
        <button
          onClick={() => router.push('/cart')}
          className="btn-outline"
        >
          View Cart
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DuplicateButtonProps {
  productId: string;
  productName: string;
}

export default function DuplicateButton({ productId, productName }: DuplicateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDuplicate = async () => {
    if (!confirm(`Duplicate "${productName}"? A copy will be created as a draft.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to duplicate product');
      }

      const data = await response.json();
      
      // Redirect to edit the new product
      router.push(`/admin/products/${data.product.id}/edit`);
      router.refresh();
    } catch (error) {
      console.error('Duplication error:', error);
      alert('Failed to duplicate product. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDuplicate}
      disabled={isLoading}
      className="text-luxury-windsor-oak hover:text-luxury-forest-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1 text-sm"
      title="Duplicate product"
    >
      <Copy className="w-4 h-4" strokeWidth={1.5} />
      {isLoading ? 'Duplicating...' : 'Duplicate'}
    </button>
  );
}

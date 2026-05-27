'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  imageUrl: string;
  categoryId: string;
  isSeasonal: boolean;
  isAvailable: boolean;
  lowStockThreshold: number;
}

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const [formData, setFormData] = useState<Product>(
    product || {
      name: '',
      slug: '',
      description: '',
      price: 0,
      quantity: 0,
      unit: 'kg',
      imageUrl: '',
      categoryId: categories[0]?.id || '',
      isSeasonal: false,
      isAvailable: true,
      lowStockThreshold: 10,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">Product Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="input-field"
            placeholder="Fresh Tomatoes"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">Slug *</label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="input-field"
            placeholder="fresh-tomatoes"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">Description *</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
            rows={4}
            placeholder="Describe the product..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Category *</label>
          <select
            required
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="input-field"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Price *</label>
          <input
            type="number"
            required
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="input-field"
            placeholder="9.99"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Quantity *</label>
          <input
            type="number"
            required
            min="0"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            className="input-field"
            placeholder="100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Unit *</label>
          <input
            type="text"
            required
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="input-field"
            placeholder="kg, tray, crate"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Low Stock Threshold *</label>
          <input
            type="number"
            required
            min="0"
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })}
            className="input-field"
            placeholder="10"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">Image URL *</label>
          <input
            type="text"
            required
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="input-field"
            placeholder="/uploads/product.jpg or https://..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload images to /public/uploads/ or use external URL
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isSeasonal}
              onChange={(e) => setFormData({ ...formData, isSeasonal: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-semibold">Seasonal Product</span>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-semibold">Available for Sale</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

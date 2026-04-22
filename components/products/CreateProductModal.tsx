'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product } from '@/services/productSchemas';
import { CreateProductSchema, CreateProductRequest } from '@/services/productSchemas';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductRequest) => void;
  isLoading?: boolean;
  editingProduct?: Product | null;
}

export default function CreateProductModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editingProduct
}: CreateProductModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<any>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
    }
  });

  useEffect(() => {
    if (editingProduct && isOpen) {
      reset({
        name: editingProduct.name,
        description: editingProduct.description || '',
        price: editingProduct.price,
        category: editingProduct.category,
        stock: editingProduct.stock,
      });
    } else if (!editingProduct && isOpen) {
      reset({
        name: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
      });
    }
  }, [editingProduct, reset, isOpen]);

  const onFormSubmit = (data: any) => {
    onSubmit(data as CreateProductRequest);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 overflow-y-auto h-full w-full z-[150] flex items-center justify-center p-4 min-h-screen">
      <div className="relative bg-white w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-white to-gray-50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p className="text-xs font-medium text-gray-500 mt-0.5">
              Fill in the details to update your inventory
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                Product Name
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Church T-Shirt"
                className={`block w-full px-4 py-3 text-gray-900 bg-gray-50 border ${errors.name ? 'border-rose-500 ring-rose-500' : 'border-gray-200'} rounded-xl text-sm focus:bg-white focus:ring-indigo-100 focus:border-indigo-600 transition-all placeholder-gray-400 font-medium`}
                disabled={isLoading}
              />
              {errors.name && <p className="mt-1.5 text-xs font-bold text-rose-500">{String(errors.name.message)}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Product details, materials, or features..."
                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-indigo-100 focus:border-indigo-600 transition-all font-medium resize-none"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                  Category
                </label>
                <select
                  {...register('category')}
                  className={`block w-full px-4 py-3 text-gray-900 bg-gray-50 border ${errors.category ? 'border-rose-500' : 'border-gray-200'} rounded-xl text-sm focus:bg-white focus:ring-indigo-100 focus:border-indigo-600 transition-all font-bold cursor-pointer appearance-none shadow-sm`}
                  disabled={isLoading}
                >
                  <option value="">Select Category</option>
                  <option value="apparel">Apparel</option>
                  <option value="books">Books</option>
                  <option value="media">Media</option>
                  <option value="accessories">Accessories</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && <p className="mt-1.5 text-xs font-bold text-rose-500">{String(errors.category.message)}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price')}
                  className={`block w-full px-4 py-3 text-gray-900 bg-gray-50 border ${errors.price ? 'border-rose-500' : 'border-gray-200'} rounded-xl text-sm focus:bg-white focus:ring-indigo-100 focus:border-indigo-600 transition-all font-bold`}
                  disabled={isLoading}
                />
                {errors.price && <p className="mt-1.5 text-xs font-bold text-rose-500">{String(errors.price.message)}</p>}
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                Available Stock
              </label>
              <div className="relative">
                <input
                  type="number"
                  {...register('stock')}
                  className={`block w-full px-4 py-3 text-gray-900 bg-gray-50 border ${errors.stock ? 'border-rose-500' : 'border-gray-200'} rounded-xl text-sm focus:bg-white focus:ring-indigo-100 focus:border-indigo-600 transition-all font-bold`}
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">units</div>
              </div>
              {errors.stock && <p className="mt-1.5 text-xs font-bold text-rose-500">{String(errors.stock.message)}</p>}
            </div>

            {/* Image Placeholder Notification */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
              <div className="text-indigo-600 font-bold text-lg mt-0.5">ⓘ</div>
              <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                Image upload is currently handled via specialized endpoints. You can manage product media in the dedicated gallery section.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-sm font-bold text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                editingProduct ? 'Update Product' : 'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Product } from '@/constant/productTypes';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onUpdateStock: (id: string, stock: number) => void;
}

export default function ProductCard({
  product,
  viewMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onUpdateStock,
}: ProductCardProps) {
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [stockValue, setStockValue] = useState(product.stock.toString());

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStock = parseInt(stockValue);
    if (!isNaN(newStock) && newStock >= 0) {
      onUpdateStock(product._id, newStock);
    }
    setIsEditingStock(false);
  };

  const handleStockCancel = () => {
    setStockValue(product.stock.toString());
    setIsEditingStock(false);
  };

  const getStockStatus = () => {
    if (product.stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (product.stock < 10) return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-50' };
    return { text: 'In Stock', color: 'text-green-600 bg-green-50' };
  };

  const stockStatus = getStockStatus();

  const formatPrice = (price: { $numberDecimal: string }) => {
    const numericPrice = parseFloat(price.$numberDecimal);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericPrice);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          
          <div className="shrink-0">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={60}
                height={60}
                className="rounded-md object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                {stockStatus.text}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">{product.description}</p>
            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
              <span>Category: {product.category}</span>
              <span>Created: {formatDate(product.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</div>
              <div className="text-xs text-gray-500">
                {isEditingStock ? (
                  <form onSubmit={handleStockSubmit} className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={stockValue}
                      onChange={(e) => setStockValue(e.target.value)}
                      className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded"
                      min="0"
                      autoFocus
                    />
                    <button type="submit" className="text-green-600 hover:text-green-800">
                      ✓
                    </button>
                    <button type="button" onClick={handleStockCancel} className="text-red-600 hover:text-red-800">
                      ✕
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsEditingStock(true)}
                    className="hover:text-blue-600"
                  >
                    Stock: {product.stock}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(product)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Edit product"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(product._id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Delete product"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(product)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit product"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete product"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Image */}
        <div className="mb-3">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-40 object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
          </div>
          
          <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</span>
            <span className="text-xs text-gray-500">{product.category}</span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
          </div>

          <div className="text-xs text-gray-500">
            {isEditingStock ? (
              <form onSubmit={handleStockSubmit} className="flex items-center space-x-1">
                <span>Stock:</span>
                <input
                  type="number"
                  value={stockValue}
                  onChange={(e) => setStockValue(e.target.value)}
                  className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded"
                  min="0"
                  autoFocus
                />
                <button type="submit" className="text-green-600 hover:text-green-800">
                  ✓
                </button>
                <button type="button" onClick={handleStockCancel} className="text-red-600 hover:text-red-800">
                  ✕
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditingStock(true)}
                className="hover:text-blue-600"
              >
                Stock: {product.stock} units
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
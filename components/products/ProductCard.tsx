'use client';

import { useState } from 'react';
import { Product } from '@/services/productSchemas';
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
  const [imgError, setImgError] = useState(false);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderImage = (width: number, height: number, className: string) => {
    if (!product.imageUrl || imgError) {
      return (
        <div className={`${className} bg-gray-200 flex items-center justify-center`}>
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      );
    }

    return (
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={width}
        height={height}
        className={className}
        onError={() => setImgError(true)}
      />
    );
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
            {renderImage(60, 60, 'w-16 h-16 rounded-md object-cover')}
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
              <span>Category: {product.category || 'Uncategorized'}</span>
              <span>Created: {product.createdAt ? formatDate(product.createdAt) : 'N/A'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {formatPrice(product.price)}
              </div>

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
                    <button type="submit" className="text-green-600">✓</button>
                    <button type="button" onClick={handleStockCancel} className="text-red-600">✕</button>
                  </form>
                ) : (
                  <button onClick={() => setIsEditingStock(true)}>
                    Stock: {product.stock}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={() => onEdit(product)} className="p-2 hover:text-blue-600">✏️</button>
              <button onClick={() => onDelete(product._id)} className="p-2 hover:text-red-600">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between mb-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
          />
          <div className="flex gap-2">
            <button onClick={() => onEdit(product)}>✏️</button>
            <button onClick={() => onDelete(product._id)}>🗑️</button>
          </div>
        </div>

        <div className="mb-3">
          {renderImage(300, 200, 'w-full h-40 object-cover rounded-md')}
        </div>

        <h3 className="text-sm font-medium">{product.name}</h3>
        <p className="text-xs text-gray-500">{product.description}</p>

        <div className="flex justify-between mt-2">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          <span className="text-xs">{product.category}</span>
        </div>

        <div className="mt-2">
          <span className={`text-xs px-2 py-1 rounded ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>

        <div className="text-xs mt-2">
          {isEditingStock ? (
            <form onSubmit={handleStockSubmit} className="flex items-center gap-1">
              <input
                type="number"
                value={stockValue}
                onChange={(e) => setStockValue(e.target.value)}
                className="w-16 border px-1"
              />
              <button type="submit">✓</button>
              <button type="button" onClick={handleStockCancel}>✕</button>
            </form>
          ) : (
            <button onClick={() => setIsEditingStock(true)}>
              Stock: {product.stock}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
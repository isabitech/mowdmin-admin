'use client';

import { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { 
  Product, 
  ProductFilters, 
  ProductStats, 
  CreateProductData,
  UpdateProductData 
} from '@/constant/productTypes';
import ProductCard from './ProductCard';
import CreateProductModal from './CreateProductModal';
import ProductStatsCards from './ProductStatsCards';
import ProductFiltersPanel from './ProductFiltersPanel';
import toast from 'react-hot-toast';

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<ProductFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadProducts();
    loadStats();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productService.getProducts(filters);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await productService.getProductStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading product stats:', error);
    }
  };

  const handleCreateProduct = async (data: CreateProductData) => {
    try {
      setIsSubmitting(true);
      if (editingProduct) {
        const updateData: UpdateProductData = { ...data, id: editingProduct._id };
        await productService.updateProduct(editingProduct._id, updateData);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(data);
        toast.success('Product created successfully');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      loadProducts();
      loadStats();
    } catch (error: any) {
      console.error('Error creating/updating product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      loadProducts();
      loadStats();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdateStock = async (id: string, stock: number) => {
    try {
      await productService.updateStock(id, stock);
      toast.success('Stock updated successfully');
      loadProducts();
      loadStats();
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast.error(error.message || 'Failed to update stock');
    }
  };

  const handleProductSelect = (productId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (isSelected) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p._id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedProducts.size} products?`)) return;

    try {
      await productService.bulkDeleteProducts(Array.from(selectedProducts));
      toast.success(`${selectedProducts.size} products deleted successfully`);
      setSelectedProducts(new Set());
      loadProducts();
      loadStats();
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  const handleApplyFilters = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage church products and merchandise inventory
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && <ProductStatsCards stats={stats} />}

      {/* Filters */}
      <ProductFiltersPanel
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Bulk Actions */}
      {selectedProducts.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      <div className="space-y-4">
        {products.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedProducts.size === products.length && products.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Select All</span>
              </label>
              <span className="text-sm text-gray-500">
                {products.length} product{products.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {products.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                viewMode={viewMode}
                isSelected={selectedProducts.has(product._id)}
                onSelect={(isSelected) => handleProductSelect(product._id, isSelected)}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onUpdateStock={handleUpdateStock}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.keys(filters).length > 0 ? 
                'Try adjusting your filters or search criteria.' : 
                'Get started by creating your first product.'
              }
            </p>
            {Object.keys(filters).length === 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Add First Product
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Product Modal */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleCreateProduct}
        isLoading={isSubmitting}
        editingProduct={editingProduct}
      />
    </div>
  );
}
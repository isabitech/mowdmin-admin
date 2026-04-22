'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  useProducts,
  useProductStats,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useBulkDeleteProducts,
  useUpdateProductStock
} from '@/hooks/useProducts';
import { Product } from '@/services/productSchemas';
import { ProductFilters } from '@/constant/productTypes';
import ProductCard from './ProductCard';
import CreateProductModal from './CreateProductModal';
import ProductStatsCards from './ProductStatsCards';
import ProductFiltersPanel from './ProductFiltersPanel';

export default function ProductManager() {
  const [page, setPage] = useState(1);
  const limit = 48; // Grid friendly (multiple of 2, 3, 4, 6)
  const [filters, setFilters] = useState<ProductFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  /* ---------------- debounce search ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- reset page on search ---------------- */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Queries
  const queryFilters = useMemo(() => ({
    ...filters,
    search: debouncedSearch,
    page,
    limit,
  }), [filters, debouncedSearch, page]);

  const { data: response, isLoading: productsLoading } = useProducts(queryFilters);
  const { data: stats } = useProductStats();

  // Mutations
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const bulkDeleteMutation = useBulkDeleteProducts();
  const updateStockMutation = useUpdateProductStock();

  const products = response?.data ?? [];
  const total = response?.total ?? 0;
  const hasMore = page * limit < total;
  const isLoading = productsLoading && products.length === 0;

  /* ---------------- Handlers ---------------- */

  const handleApplyFilters = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleCreateOrUpdateProduct = async (data: any) => {
    if (editingProduct) {
      await updateMutation.mutateAsync({ id: editingProduct._id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleUpdateStock = async (id: string, stock: number) => {
    await updateStockMutation.mutateAsync({ id, stock });
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
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.size} products?`)) {
      await bulkDeleteMutation.mutateAsync(Array.from(selectedProducts));
      setSelectedProducts(new Set());
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  /* ---------------- Loading State ---------------- */

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-sm text-gray-500 font-medium">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 sm:p-0">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between py-6 items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Products Management</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            Manage your merchandise inventory and stock levels
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-indigo-500 bg-white"
          />
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {stats && <ProductStatsCards stats={stats} />}

      {/* Filter Section */}
      <div className="bg-white/50 backdrop-blur-md border border-gray-100 rounded-2xl p-1 shadow-sm">
        <ProductFiltersPanel
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Bulk Actions Overlay */}
      {selectedProducts.size > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in slide-in-from-top-2">
          <span className="text-sm font-bold text-indigo-900">
            {selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Products Display */}
      <div className="space-y-6">
        {products.length > 0 && (
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-6">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedProducts.size === products.length && products.length > 0}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all pointer-events-none" // pointer-events-none because label handles click
                />
                <span className="ml-3 text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">
                  Select All
                </span>
              </label>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {total} products total
              </span>
            </div>
          </div>
        )}

        {products.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
              : 'space-y-4'
          }>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                viewMode={viewMode}
                isSelected={selectedProducts.has(product._id)}
                onSelect={(isSelected) => handleProductSelect(product._id, isSelected)}
                onEdit={(p: Product) => setEditingProduct(p)}
                onDelete={handleDeleteProduct}
                onUpdateStock={handleUpdateStock}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-300 rounded-3xl py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 text-gray-400 mb-6 text-3xl shadow-inner italic">
              pkg
            </div>
            <h3 className="text-lg font-bold text-gray-900">No products found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
              {Object.keys(filters).length > 0 ?
                'We couldn\'t find any products matching your filters. Try adjusting them.' :
                'Ready to start selling? Create your first product to see it here.'
              }
            </p>
            {Object.keys(filters).length === 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-8 inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all"
              >
                + Create Product
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination Fix */}
      <div className="flex items-center justify-center gap-6 py-8 border-t border-gray-100">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="inline-flex items-center px-6 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
        >
          ← Previous
        </button>

        <span className="text-sm font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg">
          Page {page}
        </span>

        <button
          onClick={() => {
            if (!hasMore) return;
            setPage((p) => p + 1);
          }}
          disabled={!hasMore}
          className="inline-flex items-center px-6 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
        >
          Next →
        </button>
      </div>

      {/* Creation Modal */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleCreateOrUpdateProduct}
        isLoading={createMutation.isPending || updateMutation.isPending}
        editingProduct={editingProduct}
      />
    </div>
  );
}

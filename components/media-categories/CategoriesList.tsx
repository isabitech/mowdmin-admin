'use client';

import { useState, useEffect } from 'react';
import { mediaCategoryService } from '@/services/mediaCategoryService';
import { MediaCategory } from '@/constant/mediaTypes';
import CreateCategoryModal from './CreateCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import CategoryTableRow from './CategoryTableRow';


export default function CategoriesList() {
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MediaCategory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await mediaCategoryService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (categoryData: any) => {
    try {
      await mediaCategoryService.createCategory(categoryData);
      setIsCreateModalOpen(false);
      await fetchCategories(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleEditCategory = (category: MediaCategory) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = async (categoryData: any) => {
    if (!editingCategory) return;
    
    try {
      await mediaCategoryService.updateCategory(editingCategory._id, categoryData);
      setIsEditModalOpen(false);
      setEditingCategory(null);
      await fetchCategories(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update category');
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await mediaCategoryService.deleteCategory(id);
      await fetchCategories(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Media Categories</h1>
          <p className="mt-2 text-sm text-gray-700">
            Organize your media content with categories like Sermons, Worship, Events, and more.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Category
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}

      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                📁
              </div>
              <p className="text-gray-500 mb-4">No categories found</p>
              <p className="text-sm text-gray-400 mb-6">
                Create categories to organize your media content like Sermons, Worship, Testimonies, etc.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Create Your First Category
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <CategoryTableRow
                      key={category._id}
                      category={category}
                      onEdit={() => handleEditCategory(category)}
                      onDelete={() => handleDeleteCategory(category._id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateCategory}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        category={editingCategory}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleUpdateCategory}
      />
    </div>
  );
}
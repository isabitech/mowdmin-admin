'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateMediaSchema, CreateMediaRequest } from '@/services/mediaSchemas';
import { mediaCategoryService } from '@/services/mediaCategoryService';
import { MediaCategory } from '@/constant/mediaTypes';
import { useCreateMedia } from '@/hooks/useMedia';

interface CreateMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export default function CreateMediaModal({ isOpen, onClose, isLoading: parentLoading }: CreateMediaModalProps) {
  const [categories, setCategories] = useState<MediaCategory[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateMediaRequest>({
    resolver: zodResolver(CreateMediaSchema),
    defaultValues: {
      title: '',
      media_url: '',
      type: 'video',
      isLive: false,
      is_downloadable: true,
    }
  });

  const createMutation = useCreateMedia();

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const data = await mediaCategoryService.getCategories();
          setCategories(data);
        } catch (err) {
          console.error('Failed to fetch categories:', err);
        }
      };
      fetchCategories();
      reset();
    }
  }, [isOpen, reset]);

  const onFormSubmit: SubmitHandler<CreateMediaRequest> = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      onClose();
    } catch (error) {
      // Error handled in hook/toast
    }
  };

  if (!isOpen) return null;

  const isLoading = parentLoading || createMutation.isPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
        <div className="relative px-8 py-6 border-b border-gray-50 bg-[#fcfdff]">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            Add New Media
          </h3>
          <button
            onClick={onClose}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all font-bold text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Title *</label>
              <input
                {...register('title')}
                placeholder="e.g. Sunday Service - Faith Over Fear"
                className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.title ? 'border-rose-500 ring-4 ring-rose-50' : 'border-gray-200'} rounded-2xl text-sm font-bold placeholder-gray-300 focus:bg-white focus:ring-indigo-50 focus:border-indigo-600 text-gray-700  transition-all`}
              />
              {errors.title && <p className="mt-1.5 text-xs font-bold text-rose-500 ml-1">{errors.title.message}</p>}
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Media Type *</label>
              <select
                {...register('type')}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 focus:bg-white focus:ring-indigo-50 focus:border-indigo-600 transition-all appearance-none cursor-pointer"
              >
                <option value="video">Video Content</option>
                <option value="audio">Audio Podcast</option>
                <option value="live">Live Stream</option>
                <option value="document">Document</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Category</label>
              <select
                {...register('category_id')}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 focus:bg-white focus:ring-indigo-50 focus:border-indigo-600 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Media URL */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Media URL / Stream Link *</label>
              <input
                {...register('media_url')}
                placeholder="e.g. https://youtube.com/watch?v=..."
                className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.media_url ? 'border-rose-500 ring-4 ring-rose-50' : 'border-gray-200'} rounded-2xl text-sm font-bold placeholder-gray-300 focus:bg-white text-gray-700 focus:ring-indigo-50 focus:border-indigo-600 transition-all`}
              />
              {errors.media_url && <p className="mt-1.5 text-xs font-bold text-rose-500 ml-1">{errors.media_url.message}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Brief summary of the content..."
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold placeholder-gray-300 focus:bg-white text-gray-700 focus:ring-indigo-50 focus:border-indigo-600 transition-all resize-none"
              />
            </div>

            {/* Thumbnail */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Thumbnail Image URL</label>
              <input
                {...register('thumbnail')}
                placeholder="e.g. https://images.com/thumb.jpg"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold placeholder-gray-300 focus:bg-white text-gray-700 focus:ring-indigo-50 focus:border-indigo-600 transition-all"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Author / Speaker</label>
              <input
                {...register('author')}
                placeholder="e.g. Pastor John Doe"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold placeholder-gray-300 focus:bg-white text-gray-700 focus:ring-indigo-50 focus:border-indigo-600 transition-all"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Duration</label>
              <input
                {...register('duration')}
                placeholder="e.g. 15:42"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold placeholder-gray-300 focus:bg-white text-gray-700 focus:ring-indigo-50 focus:border-indigo-600 transition-all"
              />
            </div>

            {/* Toggles */}
            <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('isLive')}
                  className="w-4 h-4 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer"
                />
                <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">Start as Live Stream</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('is_downloadable')}
                  className="w-4 h-4 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer"
                />
                <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">Enable Downloads</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-8 py-3.5 text-sm font-black text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3.5 bg-indigo-700 text-white rounded-xl font-black text-[11px] shadow-xl shadow-indigo-100 hover:bg-indigo-800 hover:shadow-indigo-200 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                'Add Media Content'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
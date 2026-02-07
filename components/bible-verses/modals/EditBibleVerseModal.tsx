'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { bibleVerseService } from '@/services/bibleVerseService';
import {
  BibleVerse,
  UpdateBibleVerseData,
  BibleTranslation,
  VerseCategory,
  MemoryLevel,
  CrossReference,
} from '@/constant/bibleVerseTypes';
import {
  BIBLE_TRANSLATIONS,
  VERSE_CATEGORIES,
  MEMORY_LEVELS,
} from '@/constant/bibleVerseTypes';

interface EditBibleVerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  verse: BibleVerse;
}

export const EditBibleVerseModal: React.FC<EditBibleVerseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  verse,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateBibleVerseData>({});
  const [crossReferences, setCrossReferences] = useState<Omit<CrossReference, 'id'>[]>([]);

  const bibleBooks = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
    '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
    'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Songs',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
    'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah',
    'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians',
    '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians',
    '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
    'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude',
    'Revelation'
  ];

  useEffect(() => {
    if (verse) {
      setFormData({
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text,
        translation: verse.translation,
        categories: verse.categories,
        topics: verse.topics,
        tags: verse.tags,
        themes: verse.themes,
        context: verse.context,
        commentary: verse.commentary,
        devotionalNote: verse.devotionalNote,
        memoryVerseLevel: verse.memoryVerseLevel,
        featured: verse.featured,
      });
      setCrossReferences(verse.crossReferences || []);
    }
  }, [verse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const updateData = {
        ...formData,
        crossReferences,
      };
      
      await bibleVerseService.updateBibleVerse(verse.id, updateData);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update Bible verse');
      console.error('Error updating verse:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArrayFieldToggle = <K extends keyof UpdateBibleVerseData>(
    field: K,
    value: string
  ) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFormData({ ...formData, [field]: newArray });
  };

  if (!isOpen || !verse) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Bible Verse - {verse.book} {verse.chapter}:{verse.verse}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={loading}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book
                </label>
                <select
                  value={formData.book || ''}
                  onChange={(e) => setFormData({ ...formData, book: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {bibleBooks.map((book) => (
                    <option key={book} value={book}>{book}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chapter
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.chapter || 1}
                  onChange={(e) => setFormData({ ...formData, chapter: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verse
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.verse || 1}
                  onChange={(e) => setFormData({ ...formData, verse: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Verse Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verse Text
              </label>
              <textarea
                value={formData.text || ''}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the verse text..."
              />
            </div>

            {/* Translation and Memory Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Translation
                </label>
                <select
                  value={formData.translation || 'NIV'}
                  onChange={(e) => setFormData({ ...formData, translation: e.target.value as BibleTranslation })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(BIBLE_TRANSLATIONS).map(([key, translation]) => (
                    <option key={key} value={key}>
                      {translation.abbreviation} - {translation.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Memory Level
                </label>
                <select
                  value={formData.memoryVerseLevel || 'beginner'}
                  onChange={(e) => setFormData({ ...formData, memoryVerseLevel: e.target.value as MemoryLevel })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(MEMORY_LEVELS).map(([key, level]) => (
                    <option key={key} value={key}>
                      {level.name} - {level.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                {Object.entries(VERSE_CATEGORIES).map(([key, category]) => (
                  <label key={key} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={formData.categories?.includes(key as VerseCategory) || false}
                      onChange={() => handleArrayFieldToggle('categories', key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="flex items-center">
                      {category.icon} <span className="ml-1">{category.name}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Commentary and Devotional Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentary
                </label>
                <textarea
                  value={formData.commentary || ''}
                  onChange={(e) => setFormData({ ...formData, commentary: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add commentary or explanation..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Devotional Note
                </label>
                <textarea
                  value={formData.devotionalNote || ''}
                  onChange={(e) => setFormData({ ...formData, devotionalNote: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add devotional insights..."
                />
              </div>
            </div>

            {/* Topics and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topics (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.topics?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    topics: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="faith, hope, love, prayer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="encouragement, strength, comfort"
                />
              </div>
            </div>

            {/* Featured Toggle */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Mark as featured verse
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Bible Verse'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
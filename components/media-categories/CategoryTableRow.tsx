'use client';

import { useState, useRef, useEffect } from 'react';
import { MediaCategory } from '@/constant/mediaTypes';

interface CategoryTableRowProps {
  category: MediaCategory;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CategoryTableRow({ category, onEdit, onDelete }: CategoryTableRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryIcon = (name: string) => {
    const iconMap: { [key: string]: string } = {
      sermons: '📖',
      worship: '🎵',
      testimonies: '💬',
      events: '📅',
      teachings: '🎓',
      prayer: '🙏',
      youth: '👨‍👩‍👧‍👦',
      children: '👶',
      music: '🎼',
      announcements: '📢',
    };

    const lowerName = name.toLowerCase();
    return iconMap[lowerName] || '📁';
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="shrink-0 h-10 w-10 mr-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg">
              {getCategoryIcon(category.name)}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{category.name}</div>
            <div className="text-xs text-gray-500">ID: {category._id.slice(0, 8)}...</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 max-w-xs">
          {category.description || (
            <span className="text-gray-400 italic">No description provided</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {formatDate(category.createdAt)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap w-px text-sm font-medium">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            aria-label="Actions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="4" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="10" cy="16" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1 flex flex-col">
                <button
                  onClick={() => { onEdit(); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => { onDelete(); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
'use client';

import { useState, useRef, useEffect } from 'react';
import { Media } from '@/services/mediaSchemas';

interface MediaTableRowProps {
  media: Media;
  index: number;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MediaTableRow({ media, index, onView, onEdit, onDelete }: MediaTableRowProps) {
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
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (active: boolean) => {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md border ${active
        ? 'bg-emerald-50/50 text-emerald-700 border-emerald-100'
        : 'bg-gray-50 text-gray-600 border-gray-200'
        }`}>
        <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
        Active
      </span>
    );
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'video': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'audio': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'document': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const categoryName = typeof media.category_id === 'object'
    ? media.category_id?.name
    : 'Uncategorized';

  return (
    <tr className="hover:bg-gray-50/50 transition-colors cursor-default border-b border-gray-50 last:border-0 group">
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-xs font-bold text-gray-400 font-mono tracking-tighter opacity-50">
          {String(index).padStart(2, '0')}
        </span>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-4 max-w-sm">
          <div className="relative w-12 h-8 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0 shadow-sm">
            {media.thumbnail ? (
              <img
                src={media.thumbnail}
                alt={media.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[8px] font-black uppercase text-gray-300">
                {media.type.substring(0, 3)}
              </div>
            )}
            {media.isLive && (
              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse ring-1 ring-white"></div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
              {media.title}
            </h4>
            <p className="text-[10px] font-medium text-gray-400 truncate mt-0.5 italic">
              {media.description || 'No summary available'}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${getTypeStyles(media.type)}`}>
          {media.type}
        </span>
      </td>

      <td className="px-4 py-4 whitespace-nowrap text-xs font-bold text-gray-500">
        {categoryName}
      </td>

      <td className="px-4 py-4 whitespace-nowrap">
        {getStatusBadge(media.isActive)}
      </td>

      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-700">{formatDate(media.createdAt)}</span>
          <span className="text-[10px] text-gray-400 font-medium">Added On</span>
        </div>
      </td>

      <td className="px-4 py-4 whitespace-nowrap text-center relative">
        <div className="relative inline-block text-left" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-gray-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-[100] mt-1.5 w-44 rounded-xl shadow-xl bg-white border border-gray-100 py-1.5 animate-in fade-in zoom-in-95 duration-150 shadow-indigo-100/30">
              <button
                onClick={() => { onView(); setMenuOpen(false); }}
                className="flex items-center w-full px-4 py-2 text-xs font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => { onEdit(); setMenuOpen(false); }}
                className="flex items-center w-full px-4 py-2 text-xs font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                Edit Media
              </button>
              <div className="my-1 border-t border-gray-50" />
              <button
                onClick={() => { onDelete(); setMenuOpen(false); }}
                className="flex items-center w-full px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Remove Content
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}


'use client';

import { MediaCategory } from '@/constant/mediaTypes';

interface CategoryTableRowProps {
  category: MediaCategory;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CategoryTableRow({ category, onEdit, onDelete }: CategoryTableRowProps) {
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
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-indigo-600 hover:text-indigo-900 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-900 transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
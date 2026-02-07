'use client';

import Image from 'next/image';
import { Media } from '@/constant/mediaTypes';

interface MediaTableRowProps {
  media: Media;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MediaTableRow({ media, onEdit, onDelete }: MediaTableRowProps) {
  const getTypeBadge = (isLive: boolean) => {
    if (isLive) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          🔴 Live
        </span>
      );
    } else {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          📹 Media
        </span>
      );
    }
  };

  const getStatusBadge = () => {
    // Since API doesn't have isActive field, we'll show status based on whether it has required data
    const hasRequiredData = media.title && media.thumbnail;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        hasRequiredData 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {hasRequiredData ? 'Active' : 'Incomplete'}
      </span>
    );
  };

  const getThumbnail = (thumbnail?: string) => {
    return thumbnail || '/placeholder-video.png';
  };

  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="shrink-0 h-12 w-20 mr-4">
            <img 
              className="h-12 w-20 rounded object-cover" 
              src={getThumbnail(media.thumbnail)} 
              alt={media.title}
              width={80}
              height={48}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-video.png';
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {media.title}
            </div>
            {media.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {media.description}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getTypeBadge(media.isLive)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {media.category_id?.name || 'Uncategorized'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(media.createdAt).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <a
            href={media.thumbnail}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-900"
            title="View thumbnail"
          >
            View
          </a>
          <button
            onClick={onEdit}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
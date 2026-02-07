'use client';

import { Event } from '../../constant/eventTypes';

interface EventTableRowProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EventTableRow({ event, onEdit, onDelete }: EventTableRowProps) {
  const getTypeBadge = (type: string) => {
    const typeColors = {
      Crusade: 'bg-red-100 text-red-800',
      Baptism: 'bg-blue-100 text-blue-800',
      Conference: 'bg-purple-100 text-purple-800',
      Service: 'bg-green-100 text-green-800',
      Prayer: 'bg-yellow-100 text-yellow-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${timeString}`;
  };

  const getStatusIndicator = (date: string) => {
    const eventDate = new Date(date);
    const now = new Date();
    
    if (eventDate < now) {
      return <span className="text-gray-500 text-xs">Past</span>;
    } else {
      return <span className="text-green-500 text-xs">Upcoming</span>;
    }
  };

  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center">
          {event.image && (
            <div className="shrink-0 h-12 w-12 mr-4">
              <img 
                className="h-12 w-12 rounded-lg object-cover" 
                src={event.image} 
                alt={event.title}
              />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">{event.title}</div>
            {event.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {event.description}
              </div>
            )}
            <div className="mt-1">
              {getStatusIndicator(event.date)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {formatDateTime(event.date, event.time)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{event.location}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getTypeBadge(event.type)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {event.registeredCount || 0}
          {event.capacity && ` / ${event.capacity}`}
        </div>
        {event.capacity && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-indigo-600 h-2 rounded-full" 
              style={{ 
                width: `${Math.min(((event.registeredCount || 0) / event.capacity) * 100, 100)}%` 
              }}
            ></div>
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
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
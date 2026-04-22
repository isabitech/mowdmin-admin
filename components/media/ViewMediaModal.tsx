'use client';

import { Media } from '@/services/mediaSchemas';

interface ViewMediaModalProps {
  media: Media | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewMediaModal({ media, isOpen, onClose }: ViewMediaModalProps) {
  if (!isOpen || !media) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const categoryName = typeof media.category_id === 'object' 
    ? media.category_id?.name 
    : 'General Content';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-gray-50 bg-[#fcfdff]">
          <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 text-sm">
              👁️
            </span>
            Media Details
          </h3>
          <button
            onClick={onClose}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all font-bold text-xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar text-black">
          {/* Preview Section */}
          <div className="relative aspect-video w-full rounded-2xl bg-gray-900 overflow-hidden shadow-inner ring-1 ring-gray-100">
            {media.thumbnail ? (
              <img 
                src={media.thumbnail} 
                alt={media.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <span className="text-4xl italic opacity-20 font-black tracking-widest uppercase">{media.type}</span>
                <span className="text-xs font-bold uppercase tracking-widest opacity-50">No Preview Available</span>
              </div>
            )}
            
            {media.isLive && (
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                Live Stream
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</label>
              <p className="text-lg font-bold text-gray-900 leading-tight mt-1">{media.title}</p>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
              <p className="text-sm font-medium text-gray-600 leading-relaxed mt-1">
                {media.description || <span className="italic text-gray-300">No description provided for this content.</span>}
              </p>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</label>
              <p className="text-sm font-bold text-indigo-600 mt-1">{categoryName}</p>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</label>
              <p className="text-sm font-bold text-gray-900 mt-1 capitalize">{media.type}</p>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Author / Speaker</label>
              <p className="text-sm font-bold text-gray-900 mt-1">{media.author || 'N/A'}</p>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</label>
              <p className="text-sm font-bold text-gray-900 mt-1">{media.duration || 'N/A'}</p>
            </div>

            <div className="md:col-span-2 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Created</label>
                <p className="text-xs font-bold text-gray-500 mt-1">{formatDate(media.createdAt)}</p>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Updated</label>
                <p className="text-xs font-bold text-gray-500 mt-1">{formatDate(media.updatedAt)}</p>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Media Link</label>
              <div className="mt-2 flex items-center gap-3">
                <input 
                  readOnly 
                  value={media.media_url} 
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-mono text-gray-500 outline-none truncate"
                />
                <a 
                  href={media.media_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-extrabold transition-all active:scale-95"
                >
                  Visit Link
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-50 bg-[#fcfdff] flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-gray-200 hover:bg-black active:scale-95 transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

import { Ministry } from '@/constant/ministryTypes';

interface DeleteMinistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ministry: Ministry | null;
  isSubmitting: boolean;
}

export default function DeleteMinistryModal({
  isOpen,
  onClose,
  onConfirm,
  ministry,
  isSubmitting,
}: DeleteMinistryModalProps) {
  if (!isOpen || !ministry) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-8">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl bg-red-50 border border-red-100 mb-6">
            <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Ministry</h3>
            <p className="text-sm text-gray-500 leading-relaxed px-4">
              Are you sure you want to delete <span className="font-bold text-gray-900 block mt-1">"{ministry.name}"?</span>
            </p>
            <div className="mt-6 bg-red-50/50 p-4 rounded-xl border border-red-100 flex items-start text-left">
                <svg className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 14c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Warning: This action cannot be undone and will remove all participant associations.</p>
            </div>
          </div>
        </div>

        <div className="p-8 pt-0 flex flex-col gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="w-full py-4 text-sm font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-100 rounded-xl transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Yes, Delete Ministry'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-4 text-sm font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

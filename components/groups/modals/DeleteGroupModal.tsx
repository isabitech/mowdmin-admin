import ModalWrapper from '../../ModalWrapper';

interface DeleteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  groupName: string;
  isSubmitting: boolean;
}

export default function DeleteGroupModal({
  isOpen,
  onClose,
  onConfirm,
  groupName,
  isSubmitting,
}: DeleteGroupModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="p-6">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 14c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-bold text-gray-900">Delete Group</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{groupName}"</span>?
                This action cannot be undone and all data associated with this group will be permanently removed.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className=' border text-sm bg-red-500 hover:bg-red-400 px-4 py-2 rounded-lg '
          // className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-lg shadow-red-100 p-3 bg-red-500 text-sm font-bold text-white hover:bg-red-400 focus:outline-none transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Deleting...' : 'Delete Group'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className=' border border-gray-600 px-3 py-2 text-gray-700 rounded-lg text-sm'
          // className="w-full inline-flex justify-center rounded-lg border border-gray-200 px-6 py-2.5 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  Donation,
  UpdateDonationData, 
  DonationStatus
} from '@/constant/donationTypes';
import { donationService } from '@/services/donationService';
import toast from 'react-hot-toast';

interface EditDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: Donation;
  onSuccess: (donation: Donation) => void;
}

export default function EditDonationModal({
  isOpen,
  onClose,
  donation,
  onSuccess,
}: EditDonationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateDonationData>({
    status: donation?.status,
    notes: donation?.notes,
    taxReceiptNumber: donation?.taxReceiptNumber,
    taxReceiptSent: donation?.taxReceiptSent,
  });

  useEffect(() => {
    if (isOpen && donation) {
      // Reset form data when donation changes
      setFormData({
        status: donation.status,
        notes: donation.notes,
        taxReceiptNumber: donation.taxReceiptNumber,
        taxReceiptSent: donation.taxReceiptSent,
      });
    }
  }, [isOpen, donation]);

  const handleInputChange = (field: keyof UpdateDonationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation for the fields we can update
      if (!formData.status) {
        toast.error('Please select a donation status');
        return;
      }

      const updatedDonation = await donationService.updateDonation(donation.id, formData);
      toast.success('Donation updated successfully');
      onSuccess(updatedDonation);
      onClose();
    } catch (error) {
      console.error('Error updating donation:', error);
      toast.error('Failed to update donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Edit Donation - #{donation?.id || 'Unknown'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Update donation status and administrative notes
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Donation Info (Read Only) */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Donation Information</h4>
                
                <div className="bg-gray-50 p-4 rounded-md space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Amount:</span>
                      <p className="text-gray-900">${donation?.amount?.toFixed(2) || '0.00'} {donation?.currency || 'USD'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <p className="text-gray-900 capitalize">{donation?.type?.replace('_', ' ') || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Frequency:</span>
                      <p className="text-gray-900 capitalize">{donation?.frequency?.replace('_', ' ') || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Source:</span>
                      <p className="text-gray-900 capitalize">{donation?.source?.replace('_', ' ') || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Donor:</span>
                      <p className="text-gray-900">{donation?.donor?.name || 'Anonymous'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-900">{donation?.donor?.email || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {donation?.purpose && (
                    <div>
                      <span className="font-medium text-gray-700 text-sm">Purpose:</span>
                      <p className="text-gray-900 text-sm">{donation.purpose}</p>
                    </div>
                  )}
                  
                  {donation?.message && (
                    <div>
                      <span className="font-medium text-gray-700 text-sm">Message:</span>
                      <p className="text-gray-900 text-sm">{donation.message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Editable Fields */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Update Donation</h4>
                
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status || ''}
                    onChange={(e) => handleInputChange('status', e.target.value as DonationStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                {/* Tax Receipt Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Receipt Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.taxReceiptNumber || ''}
                    onChange={(e) => handleInputChange('taxReceiptNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter tax receipt number..."
                  />
                </div>

                {/* Tax Receipt Sent */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={formData.taxReceiptSent || false}
                      onChange={(e) => handleInputChange('taxReceiptSent', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Tax Receipt Sent
                    </label>
                    <p className="text-gray-500">
                      Mark if tax receipt has been sent to donor
                    </p>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Administrative Notes (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any administrative notes about this donation..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                {isSubmitting ? 'Updating...' : 'Update Donation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
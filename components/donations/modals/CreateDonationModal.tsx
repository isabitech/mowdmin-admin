'use client';

import { useState } from 'react';
import { 
  CreateDonationData, 
  DonationCampaign,
  DonationType, 
  DonationFrequency, 
  DonationSource
} from '@/constant/donationTypes';
import toast from 'react-hot-toast';

interface CreateDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDonationData) => void;
  isLoading: boolean;
}

export default function CreateDonationModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateDonationModalProps) {
  const [campaigns] = useState<DonationCampaign[]>([]);
  const [formData, setFormData] = useState<CreateDonationData>({
    amount: 0,
    currency: 'USD',
    type: 'general',
    frequency: 'one_time',
    source: 'online',
    purpose: '',
    message: '',
    isAnonymous: false,
    isTaxDeductible: true,
    paymentMethod: 'card',
    donorEmail: '',
    donorName: '',
    donorPhone: '',
    campaignId: '',
  });

  const handleInputChange = (field: keyof CreateDonationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDonorChange = (field: string, value: string) => {
    const donorFieldMap: Record<string, keyof CreateDonationData> = {
      name: 'donorName',
      email: 'donorEmail',
      phone: 'donorPhone',
    };
    
    const mappedField = donorFieldMap[field];
    if (mappedField) {
      setFormData(prev => ({
        ...prev,
        [mappedField]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (formData.amount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }
    
    if (!formData.isAnonymous && (!formData.donorName || !formData.donorEmail)) {
      toast.error('Please provide donor name and email for non-anonymous donations');
      return;
    }

    onSubmit(formData);
  };

  const resetForm = () => {
    setFormData({
      amount: 0,
      currency: 'USD',
      type: 'general',
      frequency: 'one_time',
      source: 'online',
      purpose: '',
      message: '',
      isAnonymous: false,
      isTaxDeductible: true,
      paymentMethod: 'card',
      donorEmail: '',
      donorName: '',
      donorPhone: '',
      campaignId: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Create New Donation
            </h3>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Donation Details</h4>
                
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={formData.amount || ''}
                      onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donation Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value as DonationType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="general">General Donation</option>
                    <option value="tithe">Tithe</option>
                    <option value="offering">Offering</option>
                    <option value="building_fund">Building Fund</option>
                    <option value="missions">Missions</option>
                    <option value="youth_ministry">Youth Ministry</option>
                    <option value="childrens_ministry">Children&apos;s Ministry</option>
                    <option value="worship_music">Worship & Music</option>
                    <option value="benevolence">Benevolence</option>
                    <option value="special_event">Special Event</option>
                  </select>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency *
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => handleInputChange('frequency', e.target.value as DonationFrequency)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="one_time">One Time</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                {/* Source */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source *
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => handleInputChange('source', e.target.value as DonationSource)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="online">Online</option>
                    <option value="mobile_app">Mobile App</option>
                    <option value="in_person">In Person</option>
                    <option value="mail">Mail</option>
                    <option value="phone">Phone</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="kiosk">Kiosk</option>
                  </select>
                </div>

                {/* Campaign */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign (Optional)
                  </label>
                  <select
                    value={formData.campaignId || ''}
                    onChange={(e) => handleInputChange('campaignId', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">No Campaign</option>
                    {campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.purpose || ''}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Sunday service, Special project..."
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Donor Information</h4>
                
                {/* Anonymous checkbox */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Anonymous Donation
                    </label>
                    <p className="text-gray-500">
                      Hide donor information from public displays
                    </p>
                  </div>
                </div>

                {/* Donor fields (only show if not anonymous) */}
                {!formData.isAnonymous && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Donor Name *
                      </label>
                      <input
                        type="text"
                        required={!formData.isAnonymous}
                        value={formData.donorName || ''}
                        onChange={(e) => handleDonorChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter donor's full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required={!formData.isAnonymous}
                        value={formData.donorEmail || ''}
                        onChange={(e) => handleDonorChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="donor@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.donorPhone || ''}
                        onChange={(e) => handleDonorChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </>
                )}

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                    <option value="cash">Cash</option>
                    <option value="paypal">PayPal</option>
                    <option value="venmo">Venmo</option>
                    <option value="apple_pay">Apple Pay</option>
                    <option value="google_pay">Google Pay</option>
                  </select>
                </div>

                {/* Tax Deductible */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={formData.isTaxDeductible}
                      onChange={(e) => handleInputChange('isTaxDeductible', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Tax Deductible
                    </label>
                    <p className="text-gray-500">
                      This donation is eligible for tax deduction
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message || ''}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Optional message from donor..."
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
                disabled={isLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                {isLoading ? 'Creating...' : 'Create Donation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
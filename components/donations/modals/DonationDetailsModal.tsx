'use client';

import { Donation, DONATION_STATUS_CONFIG, DONATION_TYPE_CONFIG, DONATION_FREQUENCY_CONFIG, DONATION_SOURCE_CONFIG } from '@/constant/donationTypes';

interface DonationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: Donation;
  onEdit: (donation: Donation) => void;
  onDelete: () => void;
  onRefund: (reason: string) => void;
  onGenerateTaxReceipt: () => void;
  onSendTaxReceipt: (email?: string) => void;
}

export default function DonationDetailsModal({
  isOpen,
  onClose,
  donation,
  onEdit,
  onDelete,
  onRefund,
  onGenerateTaxReceipt,
  onSendTaxReceipt,
}: DonationDetailsModalProps) {
  if (!isOpen) return null;

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusConfig = DONATION_STATUS_CONFIG[donation.status];
  const typeConfig = DONATION_TYPE_CONFIG[donation.type];
  const frequencyConfig = DONATION_FREQUENCY_CONFIG[donation.frequency];
  const sourceConfig = DONATION_SOURCE_CONFIG[donation.source];

  const canRefund = donation.status === 'completed';
  const canGenerateReceipt = donation.status === 'completed' && donation.isTaxDeductible;
  const hasReceipt = donation.taxReceiptNumber;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Donation Details - #{donation.donationNumber}
              </h3>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Donation Info */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Donation Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Amount:</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(donation.amount, donation.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Type:</span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${typeConfig.color}`}>
                      {typeConfig.icon} {typeConfig.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Frequency:</span>
                    <span className="text-sm text-gray-900">
                      {frequencyConfig.icon} {frequencyConfig.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Source:</span>
                    <span className="text-sm text-gray-900">
                      {sourceConfig.icon} {sourceConfig.label}
                    </span>
                  </div>
                  {donation.purpose && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">Purpose:</span>
                      <span className="text-sm text-gray-900">{donation.purpose}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Tax Deductible:</span>
                    <span className={`text-sm font-medium ${
                      donation.isTaxDeductible ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {donation.isTaxDeductible ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Donor Information */}
              {!donation.isAnonymous && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Donor Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Name:</span>
                      <span className="text-sm text-gray-900">{donation.donor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Email:</span>
                      <span className="text-sm text-blue-600">{donation.donor.email}</span>
                    </div>
                    {donation.donor.phone && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Phone:</span>
                        <span className="text-sm text-gray-900">{donation.donor.phone}</span>
                      </div>
                    )}
                    {donation.donor.address && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">Address:</span>
                        <div className="text-sm text-gray-900">
                          <div>{donation.donor.address.street}</div>
                          <div>{donation.donor.address.city}, {donation.donor.address.state} {donation.donor.address.zipCode}</div>
                          <div>{donation.donor.address.country}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Campaign Information */}
              {donation.campaign && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Campaign Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Campaign:</span>
                      <span className="text-sm text-gray-900">{donation.campaign.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Goal:</span>
                      <span className="text-sm text-gray-900">
                        {formatCurrency(donation.campaign.goalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Progress:</span>
                      <span className="text-sm text-gray-900">
                        {Math.round((donation.campaign.currentAmount / donation.campaign.goalAmount) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Timeline & Actions */}
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Donation Created</p>
                      <p className="text-xs text-gray-500">{formatDate(donation.createdAt)}</p>
                    </div>
                  </div>
                  {donation.processedAt && (
                    <div className="flex items-start space-x-3">
                      <div className="shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Payment Processed</p>
                        <p className="text-xs text-gray-500">{formatDate(donation.processedAt)}</p>
                      </div>
                    </div>
                  )}
                  {donation.taxReceiptGeneratedAt && (
                    <div className="flex items-start space-x-3">
                      <div className="shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Tax Receipt Generated</p>
                        <p className="text-xs text-gray-500">{formatDate(donation.taxReceiptGeneratedAt)}</p>
                        <p className="text-xs text-gray-600">Receipt #{donation.taxReceiptNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Method:</span>
                    <span className="text-sm text-gray-900">{donation.paymentMethod}</span>
                  </div>
                  {donation.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Transaction ID:</span>
                      <span className="text-sm text-gray-900 font-mono">{donation.transactionId}</span>
                    </div>
                  )}
                  {donation.gateway && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Gateway:</span>
                      <span className="text-sm text-gray-900">{donation.gateway}</span>
                    </div>
                  )}
                  {donation.feeAmount && donation.feeAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Processing Fee:</span>
                      <span className="text-sm text-gray-900">
                        {formatCurrency(donation.feeAmount, donation.currency)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recurring Settings */}
              {donation.recurringSettings && donation.recurringSettings.isActive && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recurring Settings</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Interval:</span>
                      <span className="text-sm text-gray-900">{donation.recurringSettings.interval}</span>
                    </div>
                    {donation.recurringSettings.nextDonationDate && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Next Donation:</span>
                        <span className="text-sm text-gray-900">
                          {formatDate(donation.recurringSettings.nextDonationDate)}
                        </span>
                      </div>
                    )}
                    {donation.recurringSettings.endDate && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Ends:</span>
                        <span className="text-sm text-gray-900">
                          {formatDate(donation.recurringSettings.endDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Message */}
              {donation.message && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Donor Message</h4>
                  <p className="text-sm text-gray-700 italic">"{donation.message}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <div className="flex space-x-3">
              <button
                onClick={() => onEdit(donation)}
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
              >
                Edit Donation
              </button>
              {canGenerateReceipt && !hasReceipt && (
                <button
                  onClick={onGenerateTaxReceipt}
                  className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
                >
                  Generate Tax Receipt
                </button>
              )}
              {hasReceipt && (
                <button
                  onClick={() => onSendTaxReceipt(donation.donor.email)}
                  className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-md transition-colors"
                >
                  Send Tax Receipt
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              {canRefund && (
                <button
                  onClick={() => onRefund('Manual refund requested from details modal')}
                  className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-md transition-colors"
                >
                  Process Refund
                </button>
              )}
              <button
                onClick={onDelete}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
              >
                Delete Donation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
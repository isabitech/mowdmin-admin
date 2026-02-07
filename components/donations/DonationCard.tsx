'use client';

import { Donation } from '@/constant/donationTypes';
import { 
  DONATION_STATUS_CONFIG, 
  DONATION_TYPE_CONFIG, 
  DONATION_FREQUENCY_CONFIG, 
  DONATION_SOURCE_CONFIG 
} from '@/constant/donationTypes';

interface DonationCardProps {
  donation: Donation;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  onView: (donation: Donation) => void;
  onEdit: (donation: Donation) => void;
  onDelete: () => void;
  onRefund: (reason: string) => void;
  onGenerateTaxReceipt: () => void;
  onSendTaxReceipt: (email?: string) => void;
}

export default function DonationCard({
  donation,
  viewMode,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
  onRefund,
  onGenerateTaxReceipt,
  onSendTaxReceipt,
}: DonationCardProps) {
  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">#{donation.donationNumber}</span>
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(donation.amount, donation.currency)}
              </span>
              <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${typeConfig.color}`}>
                <span className="mr-1">{typeConfig.icon}</span>
                {typeConfig.label}
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="font-medium">
                {donation.isAnonymous ? 'Anonymous Donor' : donation.donor.name}
              </p>
              {!donation.isAnonymous && (
                <p>{donation.donor.email}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{frequencyConfig.icon} {frequencyConfig.label}</span>
              <span>{sourceConfig.icon} {sourceConfig.label}</span>
            </div>

            <div className="text-xs text-gray-500">
              {formatDate(donation.createdAt)}
            </div>

            {donation.campaign && (
              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Campaign: {donation.campaign.name}
              </div>
            )}

            {donation.isTaxDeductible && (
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Tax Deductible</span>
                {hasReceipt && <span>(Receipt #{donation.taxReceiptNumber})</span>}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <button
              onClick={() => onView(donation)}
              className="text-xs font-medium text-blue-600 hover:text-blue-500"
            >
              View Details
            </button>
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(donation)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
              >
                Edit
              </button>
              {canGenerateReceipt && !hasReceipt && (
                <button
                  onClick={onGenerateTaxReceipt}
                  className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                >
                  Receipt
                </button>
              )}
              {canRefund && (
                <button
                  onClick={() => onRefund('Manual refund requested')}
                  className="px-2 py-1 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 rounded transition-colors"
                >
                  Refund
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900">#{donation.donationNumber}</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${typeConfig.color}`}>
                  <span className="mr-1">{typeConfig.icon}</span>
                  {typeConfig.label}
                </span>
                {donation.isTaxDeductible && (
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Tax Deductible
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span>{donation.isAnonymous ? 'Anonymous Donor' : donation.donor.name}</span>
                {!donation.isAnonymous && (
                  <>
                    <span>•</span>
                    <span>{donation.donor.email}</span>
                  </>
                )}
                <span>•</span>
                <span>{formatDate(donation.createdAt)}</span>
                {donation.campaign && (
                  <>
                    <span>•</span>
                    <span className="text-blue-600">Campaign: {donation.campaign.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(donation.amount, donation.currency)}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{frequencyConfig.icon} {frequencyConfig.label}</span>
                <span>•</span>
                <span>{sourceConfig.icon} {sourceConfig.label}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onView(donation)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="View Details"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              <button
                onClick={() => onEdit(donation)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
              >
                Edit
              </button>
              
              {canGenerateReceipt && !hasReceipt && (
                <button
                  onClick={onGenerateTaxReceipt}
                  className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                >
                  Generate Receipt
                </button>
              )}
              
              {canRefund && (
                <button
                  onClick={() => onRefund('Manual refund requested')}
                  className="px-3 py-1 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 rounded transition-colors"
                >
                  Refund
                </button>
              )}
              
              <button
                onClick={onDelete}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete Donation"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {donation.purpose && (
          <div className="mt-2 text-sm text-gray-600 line-clamp-2">
            <strong>Purpose:</strong> {donation.purpose}
          </div>
        )}
        
        {donation.message && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-sm text-blue-800">
              <strong>Message:</strong> {donation.message}
            </div>
          </div>
        )}
        
        {donation.recurringSettings && donation.recurringSettings.isActive && (
          <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded-md">
            <div className="text-sm text-purple-800">
              <strong>Recurring:</strong> {donation.recurringSettings.interval}
              {donation.recurringSettings.nextDonationDate && (
                <span className="ml-2">
                  Next: {formatDate(donation.recurringSettings.nextDonationDate)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
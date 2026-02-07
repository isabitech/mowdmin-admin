'use client';

import { useState, useEffect, useCallback } from 'react';
import { donationService } from '@/services/donationService';
import { 
  Donation,
  DonationFilters,
  DonationStats,
  CreateDonationData,
  UpdateDonationData
} from '@/constant/donationTypes';
import DonationCard from './DonationCard';
import DonationFiltersPanel from './DonationFiltersPanel';
import DonationStatsCards from './DonationStatsCards';
import DonationDetailsModal from './modals/DonationDetailsModal';
import CreateDonationModal from './modals/CreateDonationModal';
import EditDonationModal from './modals/EditDonationModal';
import CampaignManager from './CampaignManager';
import toast from 'react-hot-toast';

export default function DonationManager() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDonations, setSelectedDonations] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<DonationFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeTab, setActiveTab] = useState<'donations' | 'campaigns'>('donations');
  
  // Modal states
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadDonations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await donationService.getDonations(filters, currentPage, 20);
      setDonations(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error: any) {
      console.error('Error loading donations:', error);
      toast.error(error.message || 'Failed to load donations');
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage]);

  const loadStats = useCallback(async () => {
    try {
      const statsData = await donationService.getDonationStats(filters);
      setStats(statsData);
    } catch (error: any) {
      console.error('Error loading donation stats:', error);
      // Don't show error toast for stats as it's not critical
    }
  }, [filters]);

  useEffect(() => {
    if (activeTab === 'donations') {
      loadDonations();
      loadStats();
    }
  }, [filters, currentPage, activeTab, loadDonations, loadStats]);

  const handleDonationSelect = (donationId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedDonations);
    if (isSelected) {
      newSelected.add(donationId);
    } else {
      newSelected.delete(donationId);
    }
    setSelectedDonations(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDonations.size === donations.length) {
      setSelectedDonations(new Set());
    } else {
      setSelectedDonations(new Set(donations.map(d => d.id)));
    }
  };

  const handleViewDonation = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsDetailsModalOpen(true);
  };

  const handleEditDonation = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsEditModalOpen(true);
  };

  const handleCreateDonation = async (data: CreateDonationData) => {
    try {
      setIsSubmitting(true);
      await donationService.createDonation(data);
      toast.success('Donation created successfully');
      setIsCreateModalOpen(false);
      loadDonations();
      loadStats();
    } catch (error: any) {
      console.error('Error creating donation:', error);
      toast.error(error.message || 'Failed to create donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDonation = async (data: UpdateDonationData) => {
    if (!selectedDonation) return;

    try {
      setIsSubmitting(true);
      await donationService.updateDonation(selectedDonation.id, data);
      toast.success('Donation updated successfully');
      setIsEditModalOpen(false);
      setSelectedDonation(null);
      loadDonations();
      loadStats();
    } catch (error: any) {
      console.error('Error updating donation:', error);
      toast.error(error.message || 'Failed to update donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDonation = async (donationId: string) => {
    if (!confirm('Are you sure you want to delete this donation?')) return;

    try {
      await donationService.deleteDonation(donationId);
      toast.success('Donation deleted successfully');
      loadDonations();
      loadStats();
    } catch (error: any) {
      console.error('Error deleting donation:', error);
      toast.error(error.message || 'Failed to delete donation');
    }
  };

  const handleRefundDonation = async (donationId: string, reason: string) => {
    try {
      await donationService.refundDonation(donationId, reason);
      toast.success('Donation refunded successfully');
      loadDonations();
      loadStats();
    } catch (error: any) {
      console.error('Error refunding donation:', error);
      toast.error(error.message || 'Failed to refund donation');
    }
  };

  const handleGenerateTaxReceipt = async (donationId: string) => {
    try {
      const receipt = await donationService.generateTaxReceipt(donationId);
      toast.success('Tax receipt generated successfully');
      
      // Open receipt in new window
      if (receipt?.receiptUrl) {
        window.open(receipt.receiptUrl, '_blank');
      }
      
      loadDonations();
    } catch (error: any) {
      console.error('Error generating tax receipt:', error);
      toast.error(error.message || 'Failed to generate tax receipt');
    }
  };

  const handleSendTaxReceipt = async (donationId: string, email?: string) => {
    try {
      await donationService.sendTaxReceipt(donationId, email);
      toast.success('Tax receipt sent successfully');
      loadDonations();
    } catch (error: any) {
      console.error('Error sending tax receipt:', error);
      toast.error(error.message || 'Failed to send tax receipt');
    }
  };

  const handleBulkTaxReceipts = async () => {
    if (selectedDonations.size === 0) return;

    try {
      const result = await donationService.bulkGenerateTaxReceipts(Array.from(selectedDonations));
      if (result?.success?.length) {
        toast.success(`${result.success.length} tax receipts generated successfully`);
      }
      if (result?.failed?.length) {
        toast.error(`${result.failed.length} tax receipts failed to generate`);
      }
      setSelectedDonations(new Set());
      loadDonations();
    } catch (error: any) {
      console.error('Error generating bulk tax receipts:', error);
      toast.error(error.message || 'Failed to generate tax receipts');
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedDonations.size === 0) return;

    try {
      const result = await donationService.bulkUpdateDonationStatus(Array.from(selectedDonations), status);
      if (result?.success?.length) {
        toast.success(`${result.success.length} donations updated successfully`);
      }
      if (result?.failed?.length) {
        toast.error(`${result.failed.length} donations failed to update`);
      }
      setSelectedDonations(new Set());
      loadDonations();
      loadStats();
    } catch (error: any) {
      console.error('Error bulk updating donations:', error);
      toast.error(error.message || 'Failed to update donations');
    }
  };

  const handleExportDonations = async () => {
    try {
      const blob = await donationService.exportDonations(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `donations-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Donations exported successfully');
    } catch (error: any) {
      console.error('Error exporting donations:', error);
      toast.error(error.message || 'Failed to export donations');
    }
  };

  const handleApplyFilters = (newFilters: DonationFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && donations.length === 0 && activeTab === 'donations') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage donations, campaigns, and donor relationships
          </p>
        </div>
        <div className="flex space-x-4">
          {activeTab === 'donations' && (
            <>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add Donation
              </button>
              <button
                onClick={handleExportDonations}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Export Donations
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('donations')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'donations'             ? 'border-blue-500 text-blue-600': 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Donations
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'campaigns'? 'border-blue-500 text-blue-600': 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Campaigns
          </button>
        </nav>
      </div>

      {activeTab === 'donations' ? (
        <>
          {/* Stats Cards */}
          {stats && <DonationStatsCards stats={stats} />}

          {/* Filters */}
          <DonationFiltersPanel
            filters={filters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />

          {/* Bulk Actions */}
          {selectedDonations.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedDonations.size} donation{selectedDonations.size > 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkStatusUpdate('completed')}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors"
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('failed')}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
                  >
                    Mark Failed
                  </button>
                  <button
                    onClick={handleBulkTaxReceipts}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors"
                  >
                    Generate Receipts
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Donations List */}
          <div className="space-y-4">
            {donations.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDonations.size === donations.length && donations.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Select All</span>
                  </label>
                  <span className="text-sm text-gray-500">
                    {donations.length} donation{donations.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {donations.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {donations.map((donation) => (
                  <DonationCard
                    key={donation.id}
                    donation={donation}
                    viewMode={viewMode}
                    isSelected={selectedDonations.has(donation.id)}
                    onSelect={(isSelected) => handleDonationSelect(donation.id, isSelected)}
                    onView={handleViewDonation}
                    onEdit={handleEditDonation}
                    onDelete={() => handleDeleteDonation(donation.id)}
                    onRefund={(reason) => handleRefundDonation(donation.id, reason)}
                    onGenerateTaxReceipt={() => handleGenerateTaxReceipt(donation.id)}
                    onSendTaxReceipt={(email) => handleSendTaxReceipt(donation.id, email)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No donations found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {Object.keys(filters).length > 0 ? 
                    'Try adjusting your filters or search criteria.' : 
                    'Donations will appear here when people make contributions.'}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <CampaignManager />
      )}

      {/* Modals */}
      <DonationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedDonation(null);
        }}
        donation={selectedDonation!}
        onEdit={(donation) => {
          setSelectedDonation(donation);
          setIsDetailsModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={() => {
          if (selectedDonation) {
            handleDeleteDonation(selectedDonation.id);
            setIsDetailsModalOpen(false);
            setSelectedDonation(null);
          }
        }}
        onRefund={(reason) => {
          if (selectedDonation) {
            handleRefundDonation(selectedDonation.id, reason);
            setIsDetailsModalOpen(false);
            setSelectedDonation(null);
          }
        }}
        onGenerateTaxReceipt={() => {
          if (selectedDonation) {
            handleGenerateTaxReceipt(selectedDonation.id);
          }
        }}
        onSendTaxReceipt={(email) => {
          if (selectedDonation) {
            handleSendTaxReceipt(selectedDonation.id, email);
          }
        }}
      />

      <CreateDonationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDonation}
        isLoading={isSubmitting}
      />

      <EditDonationModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDonation(null);
        }}
        donation={selectedDonation!}
        onSuccess={() => {
          toast.success('Donation updated successfully');
          setIsEditModalOpen(false);
          setSelectedDonation(null);
          loadDonations();
          loadStats();
        }}
      />
    </div>
  );
}
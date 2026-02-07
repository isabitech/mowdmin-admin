'use client';

import { useState, useEffect } from 'react';
import { donationService } from '@/services/donationService';
import { 
  DonationCampaign,
  CreateCampaignData,
  UpdateCampaignData,
  CAMPAIGN_STATUS_CONFIG 
} from '@/constant/donationTypes';
import toast from 'react-hot-toast';

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaigns, setSelectedCampaigns] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, [currentPage]);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const response = await donationService.getCampaigns(currentPage, 20);
      setCampaigns(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = async (data: CreateCampaignData) => {
    try {
      setIsSubmitting(true);
      await donationService.createCampaign(data);
      toast.success('Campaign created successfully');
      setIsCreateModalOpen(false);
      loadCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCampaign = async (data: UpdateCampaignData) => {
    if (!selectedCampaign) return;

    try {
      setIsSubmitting(true);
      await donationService.updateCampaign(selectedCampaign.id, data);
      toast.success('Campaign updated successfully');
      setIsEditModalOpen(false);
      setSelectedCampaign(null);
      loadCampaigns();
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast.error('Failed to update campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await donationService.deleteCampaign(campaignId);
      toast.success('Campaign deleted successfully');
      loadCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Failed to delete campaign');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateProgress = (campaign: DonationCampaign) => {
    if (campaign.goalAmount === 0) return 0;
    return Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100);
  };

  if (isLoading && campaigns.length === 0) {
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
          <h2 className="text-xl font-semibold text-gray-900">Donation Campaigns</h2>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage fundraising campaigns
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Create Campaign
        </button>
      </div>

      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const statusConfig = CAMPAIGN_STATUS_CONFIG[campaign.status];
            const progress = calculateProgress(campaign);
            
            return (
              <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                {campaign.imageUrl && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {campaign.description}
                      </p>
                    </div>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, progress)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Raised:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(campaign.currentAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Goal:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(campaign.goalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Donors:</span>
                      <span className="font-semibold text-gray-900">
                        {campaign.donorCount}
                      </span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="text-xs text-gray-500 mb-4 space-y-1">
                    <div>Started: {formatDate(campaign.startDate)}</div>
                    {campaign.endDate && (
                      <div>Ends: {formatDate(campaign.endDate)}</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <button
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setIsEditModalOpen(true);
                      }}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Edit Campaign
                    </button>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first fundraising campaign to start raising donations.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
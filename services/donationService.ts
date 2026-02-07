import api from './authService';
import { endpoints } from '@/constant/endpoints';
import { 
  Donation,
  DonationCampaign,
  Donor,
  DonationFilters,
  DonationStats,
  DonationResponse,
  CampaignResponse,
  CreateDonationData,
  UpdateDonationData,
  CreateCampaignData,
  UpdateCampaignData
} from '@/constant/donationTypes';

export const donationService = {
  // Donations CRUD
  async getDonations(filters: DonationFilters = {}, page: number = 1, limit: number = 20): Promise<DonationResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.status?.length) {
        params.append('status', filters.status.join(','));
      }
      if (filters.type?.length) {
        params.append('type', filters.type.join(','));
      }
      if (filters.frequency?.length) {
        params.append('frequency', filters.frequency.join(','));
      }
      if (filters.source?.length) {
        params.append('source', filters.source.join(','));
      }
      if (filters.campaignId) {
        params.append('campaignId', filters.campaignId);
      }
      if (filters.donorId) {
        params.append('donorId', filters.donorId);
      }
      if (filters.amountMin !== undefined) {
        params.append('amountMin', filters.amountMin.toString());
      }
      if (filters.amountMax !== undefined) {
        params.append('amountMax', filters.amountMax.toString());
      }
      if (filters.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params.append('dateTo', filters.dateTo);
      }
      if (filters.isAnonymous !== undefined) {
        params.append('isAnonymous', filters.isAnonymous.toString());
      }
      if (filters.isTaxDeductible !== undefined) {
        params.append('isTaxDeductible', filters.isTaxDeductible.toString());
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await api.get(`${endpoints.donations.list}?${params.toString()}`);
      
      // Handle nested API response structure
      if (response.data?.data) {
        const currentPage = response.data.data.meta?.page || page;
        const totalPages = response.data.data.meta?.totalPages || 0;
        
        return {
          data: response.data.data.data || [],
          pagination: {
            currentPage,
            totalPages,
            totalCount: response.data.data.meta?.total || 0,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1,
            limit: response.data.data.meta?.limit || limit,
          },
        };
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while fetching donations. Please try again later.');
      }
      throw error;
    }
  },

  async getDonation(donationId: string): Promise<Donation> {
    const response = await api.get(endpoints.donations.single(donationId));
    return response.data;
  },

  async createDonation(data: CreateDonationData): Promise<Donation> {
    try {
      const response = await api.post(endpoints.donations.create, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while creating donation. Please try again later.');
      }
      throw error;
    }
  },

  async updateDonation(donationId: string, data: UpdateDonationData): Promise<Donation> {
    try {
      const response = await api.patch(endpoints.donations.update(donationId), data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while updating donation. Please try again later.');
      }
      throw error;
    }
  },

  async deleteDonation(donationId: string): Promise<void> {
    try {
      await api.delete(endpoints.donations.delete(donationId));
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while deleting donation. Please try again later.');
      }
      throw error;
    }
  },

  // Donation Statistics
  async getDonationStats(filters: DonationFilters = {}): Promise<DonationStats> {
    try {
      const params = new URLSearchParams();
      
      if (filters.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params.append('dateTo', filters.dateTo);
      }
      if (filters.type?.length) {
        params.append('type', filters.type.join(','));
      }
      if (filters.campaignId) {
        params.append('campaignId', filters.campaignId);
      }
      
      const response = await api.get(`${endpoints.donations.stats}?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while fetching donation statistics. Please try again later.');
      }
      throw error;
    }
  },

  // Donation Campaigns CRUD
  async getCampaigns(page: number = 1, limit: number = 20): Promise<CampaignResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await api.get(`${endpoints.donations.campaigns.list}?${params.toString()}`);
    return response.data;
  },

  async getCampaign(campaignId: string): Promise<DonationCampaign> {
    const response = await api.get(endpoints.donations.campaigns.single(campaignId));
    return response.data;
  },

  async createCampaign(data: CreateCampaignData): Promise<DonationCampaign> {
    const response = await api.post(endpoints.donations.campaigns.create, data);
    return response.data;
  },

  async updateCampaign(campaignId: string, data: UpdateCampaignData): Promise<DonationCampaign> {
    const response = await api.patch(
      endpoints.donations.campaigns.update(campaignId),
      data
    );
    return response.data;
  },

  async deleteCampaign(campaignId: string): Promise<void> {
    await api.delete(endpoints.donations.campaigns.delete(campaignId));
  },

  // Donors Management
  async getDonors(page: number = 1, limit: number = 20, search?: string): Promise<{
    data: Donor[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await api.get(`${endpoints.donations.donors.list}?${params.toString()}`);
    return response.data;
  },

  async getDonor(donorId: string): Promise<Donor> {
    const response = await api.get(endpoints.donations.donors.single(donorId));
    return response.data;
  },

  async updateDonor(donorId: string, data: Partial<Donor>): Promise<Donor> {
    const response = await api.patch(
      endpoints.donations.donors.update(donorId),
      data
    );
    return response.data;
  },

  // Tax Receipts
  async generateTaxReceipt(donationId: string): Promise<{
    receiptNumber: string;
    receiptUrl: string;
  }> {
    const response = await api.post(
      endpoints.donations.taxReceipt(donationId)
    );
    return response.data;
  },

  async sendTaxReceipt(donationId: string, email?: string): Promise<void> {
    await api.post(
      endpoints.donations.sendReceipt(donationId),
      { email }
    );
  },

  async bulkGenerateTaxReceipts(donationIds: string[]): Promise<{
    success: string[];
    failed: string[];
  }> {
    const response = await api.post(endpoints.donations.bulkTaxReceipts, {
      donationIds,
    });
    return response.data;
  },

  // Export Functions
  async exportDonations(filters: DonationFilters = {}, format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters.status?.length) {
      params.append('status', filters.status.join(','));
    }
    if (filters.type?.length) {
      params.append('type', filters.type.join(','));
    }
    if (filters.dateFrom) {
      params.append('dateFrom', filters.dateFrom);
    }
    if (filters.dateTo) {
      params.append('dateTo', filters.dateTo);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    params.append('format', format);
    
    const response = await api.get(`${endpoints.donations.export}?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async exportDonors(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams({
      format,
    });
    
    const response = await api.get(`${endpoints.donations.donors.export}?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Recurring Donations
  async pauseRecurringDonation(donationId: string): Promise<Donation> {
    const response = await api.post(
      endpoints.donations.pauseRecurring(donationId)
    );
    return response.data;
  },

  async resumeRecurringDonation(donationId: string): Promise<Donation> {
    const response = await api.post(
      endpoints.donations.resumeRecurring(donationId)
    );
    return response.data;
  },

  async cancelRecurringDonation(donationId: string, reason: string): Promise<Donation> {
    const response = await api.post(
      endpoints.donations.cancelRecurring(donationId),
      { reason }
    );
    return response.data;
  },

  // Analytics
  async getDonationAnalytics(
    dateRange: { from: string; to: string },
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<{
    totalAmount: number;
    totalCount: number;
    averageAmount: number;
    recurringPercentage: number;
    chartData: {
      date: string;
      amount: number;
      count: number;
    }[];
    donorRetentionRate: number;
  }> {
    const params = new URLSearchParams({
      dateFrom: dateRange.from,
      dateTo: dateRange.to,
      groupBy,
    });
    
    const response = await api.get(`${endpoints.donations.analytics}?${params.toString()}`);
    return response.data;
  },

  async getCampaignAnalytics(campaignId: string): Promise<{
    totalRaised: number;
    donorCount: number;
    averageDonation: number;
    progressPercentage: number;
    dailyProgress: {
      date: string;
      amount: number;
      count: number;
    }[];
    topDonors: {
      donor: Donor;
      amount: number;
    }[];
  }> {
    const response = await api.get(
      endpoints.donations.campaigns.analytics(campaignId)
    );
    return response.data;
  },

  // Bulk Operations
  async bulkUpdateDonationStatus(
    donationIds: string[],
    status: string
  ): Promise<{ success: string[]; failed: string[] }> {
    const response = await api.post(endpoints.donations.bulkUpdate, {
      donationIds,
      status,
    });
    return response.data;
  },

  async refundDonation(donationId: string, reason: string): Promise<Donation> {
    const response = await api.post(
      endpoints.donations.refund(donationId),
      { reason }
    );
    return response.data;
  },
};
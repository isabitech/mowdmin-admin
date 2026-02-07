export interface Donation {
  id: string;
  donationNumber: string;
  donorId: string;
  donor: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  campaignId?: string;
  campaign?: {
    id: string;
    name: string;
    description: string;
    goalAmount: number;
    currentAmount: number;
    endDate?: string;
  };
  amount: number;
  currency: string;
  type: DonationType;
  frequency: DonationFrequency;
  status: DonationStatus;
  paymentId?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  purpose: string;
  message?: string;
  isAnonymous: boolean;
  isTaxDeductible: boolean;
  taxReceiptNumber?: string;
  taxReceiptSent?: boolean;
  source: DonationSource;
  recurringSettings?: {
    interval: 'weekly' | 'monthly' | 'quarterly' | 'annually';
    nextDonationDate?: string;
    endDate?: string;
    isActive: boolean;
  };
  metadata?: Record<string, any>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
}

export interface DonationCampaign {
  id: string;
  name: string;
  description: string;
  purpose: string;
  goalAmount: number;
  currentAmount: number;
  donorCount: number;
  status: CampaignStatus;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  isActive: boolean;
  createdBy: string;
  donations: Donation[];
  createdAt: string;
  updatedAt: string;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  totalDonated: number;
  donationCount: number;
  firstDonationDate: string;
  lastDonationDate?: string;
  isRecurringDonor: boolean;
  preferredDonationMethod?: string;
  taxId?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type DonationType = 'general' | 'tithe' | 'offering' | 'building_fund' | 'missions' | 'special_project' | 'emergency_relief' | 'other';
export type DonationFrequency = 'one_time' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
export type DonationStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
export type DonationSource = 'online' | 'mobile_app' | 'in_person' | 'bank_transfer' | 'check' | 'cash' | 'other';
export type CampaignStatus = 'draft' | 'active' | 'completed' | 'cancelled' | 'expired';

export interface DonationFilters {
  status?: DonationStatus[];
  type?: DonationType[];
  frequency?: DonationFrequency[];
  source?: DonationSource[];
  campaignId?: string;
  donorId?: string;
  amountMin?: number;
  amountMax?: number;
  dateFrom?: string;
  dateTo?: string;
  isAnonymous?: boolean;
  isTaxDeductible?: boolean;
  search?: string;
}

export interface DonationStats {
  total: {
    count: number;
    amount: number;
  };
  completed: {
    count: number;
    amount: number;
  };
  pending: {
    count: number;
    amount: number;
  };
  failed: {
    count: number;
    amount: number;
  };
  byType: Record<DonationType, {
    count: number;
    amount: number;
  }>;
  bySource: Record<DonationSource, {
    count: number;
    amount: number;
  }>;
  byFrequency: Record<DonationFrequency, {
    count: number;
    amount: number;
  }>;
  monthlyTrend: {
    month: string;
    amount: number;
    count: number;
  }[];
  topDonors: {
    donor: Donor;
    totalAmount: number;
    donationCount: number;
  }[];
  activeCampaigns: number;
  recurringDonors: number;
}

export interface CreateDonationData {
  donorEmail: string;
  donorName?: string;
  donorPhone?: string;
  donorAddress?: string;
  amount: number;
  currency: string;
  type: DonationType;
  frequency: DonationFrequency;
  purpose: string;
  message?: string;
  campaignId?: string;
  isAnonymous?: boolean;
  isTaxDeductible?: boolean;
  source: DonationSource;
  paymentMethod?: string;
  recurringSettings?: {
    interval: 'weekly' | 'monthly' | 'quarterly' | 'annually';
    endDate?: string;
  };
  notes?: string;
}

export interface UpdateDonationData {
  status?: DonationStatus;
  notes?: string;
  taxReceiptNumber?: string;
  taxReceiptSent?: boolean;
}

export interface CreateCampaignData {
  name: string;
  description: string;
  purpose: string;
  goalAmount: number;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
}

export interface UpdateCampaignData {
  name?: string;
  description?: string;
  purpose?: string;
  goalAmount?: number;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  status?: CampaignStatus;
  isActive?: boolean;
}

export interface DonationResponse {
  data: Donation[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: any
  };
}

export interface CampaignResponse {
  data: DonationCampaign[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Donation Status Configurations
export const DONATION_STATUS_CONFIG: Record<DonationStatus, {
  label: string;
  color: string;
  description: string;
}> = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Donation is awaiting processing',
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800',
    description: 'Donation has been successfully processed',
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-100 text-red-800',
    description: 'Donation failed to process',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-gray-100 text-gray-800',
    description: 'Donation was cancelled',
  },
  refunded: {
    label: 'Refunded',
    color: 'bg-purple-100 text-purple-800',
    description: 'Donation was refunded',
  },
};

// Donation Type Configurations
export const DONATION_TYPE_CONFIG: Record<DonationType, {
  label: string;
  color: string;
  icon: string;
  description: string;
}> = {
  general: {
    label: 'General',
    color: 'bg-blue-100 text-blue-800',
    icon: '💝',
    description: 'General church support',
  },
  tithe: {
    label: 'Tithe',
    color: 'bg-green-100 text-green-800',
    icon: '🙏',
    description: 'Regular tithing contribution',
  },
  offering: {
    label: 'Offering',
    color: 'bg-purple-100 text-purple-800',
    icon: '💰',
    description: 'Special offering donation',
  },
  building_fund: {
    label: 'Building Fund',
    color: 'bg-orange-100 text-orange-800',
    icon: '🏗️',
    description: 'Building and construction projects',
  },
  missions: {
    label: 'Missions',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '🌍',
    description: 'Missionary work and outreach',
  },
  special_project: {
    label: 'Special Project',
    color: 'bg-pink-100 text-pink-800',
    icon: '⭐',
    description: 'Special church projects',
  },
  emergency_relief: {
    label: 'Emergency Relief',
    color: 'bg-red-100 text-red-800',
    icon: '🚨',
    description: 'Emergency and disaster relief',
  },
  other: {
    label: 'Other',
    color: 'bg-gray-100 text-gray-800',
    icon: '📋',
    description: 'Other donation purposes',
  },
};

// Donation Frequency Configurations
export const DONATION_FREQUENCY_CONFIG: Record<DonationFrequency, {
  label: string;
  icon: string;
}> = {
  one_time: {
    label: 'One-time',
    icon: '1️⃣',
  },
  weekly: {
    label: 'Weekly',
    icon: '📅',
  },
  monthly: {
    label: 'Monthly',
    icon: '🗓️',
  },
  quarterly: {
    label: 'Quarterly',
    icon: '📊',
  },
  annually: {
    label: 'Annually',
    icon: '📆',
  },
};

// Donation Source Configurations
export const DONATION_SOURCE_CONFIG: Record<DonationSource, {
  label: string;
  icon: string;
}> = {
  online: {
    label: 'Online',
    icon: '💻',
  },
  mobile_app: {
    label: 'Mobile App',
    icon: '📱',
  },
  in_person: {
    label: 'In Person',
    icon: '👤',
  },
  bank_transfer: {
    label: 'Bank Transfer',
    icon: '🏦',
  },
  check: {
    label: 'Check',
    icon: '📝',
  },
  cash: {
    label: 'Cash',
    icon: '💵',
  },
  other: {
    label: 'Other',
    icon: '🔄',
  },
};

// Campaign Status Configurations
export const CAMPAIGN_STATUS_CONFIG: Record<CampaignStatus, {
  label: string;
  color: string;
  description: string;
}> = {
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-800',
    description: 'Campaign is being prepared',
  },
  active: {
    label: 'Active',
    color: 'bg-green-100 text-green-800',
    description: 'Campaign is currently running',
  },
  completed: {
    label: 'Completed',
    color: 'bg-blue-100 text-blue-800',
    description: 'Campaign has reached its goal',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    description: 'Campaign was cancelled',
  },
  expired: {
    label: 'Expired',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Campaign has expired',
  },
};
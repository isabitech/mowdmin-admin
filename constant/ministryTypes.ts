// Ministry Types and Interfaces
export type MinistryType = 
  | 'worship'
  | 'youth'
  | 'children'
  | 'seniors'
  | 'mens'
  | 'womens'
  | 'missions'
  | 'evangelism'
  | 'discipleship'
  | 'pastoral_care'
  | 'music'
  | 'media_tech'
  | 'hospitality'
  | 'community_outreach'
  | 'education'
  | 'sports_recreation'
  | 'marriage_family'
  | 'prayer_intercession'
  | 'administration'
  | 'facilities';

export type MinistryStatus = 
  | 'active'
  | 'inactive'
  | 'planning'
  | 'on_hold'
  | 'completed';

export type ParticipantRole = 
  | 'leader'
  | 'co_leader'
  | 'coordinator'
  | 'volunteer'
  | 'participant'
  | 'visitor';

export type MinistryPriority = 
  | 'high'
  | 'medium'
  | 'low';

export type ResourceType = 
  | 'budget'
  | 'equipment'
  | 'materials'
  | 'facility'
  | 'personnel'
  | 'training';

// Participant interface
export interface MinistryParticipant {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  role: ParticipantRole;
  joinedAt: string;
  leftAt?: string;
  isActive: boolean;
  skills?: string[];
  availability?: {
    days: string[];
    times: string[];
    frequency: string;
  };
  notes?: string;
  trainingCompleted?: {
    program: string;
    completedAt: string;
    certificateUrl?: string;
  }[];
}

// Resource interface
export interface MinistryResource {
  id: string;
  type: ResourceType;
  name: string;
  description: string;
  quantity?: number;
  cost?: number;
  allocatedAt: string;
  status: 'available' | 'allocated' | 'in_use' | 'maintenance' | 'unavailable';
  notes?: string;
  location?: string;
  responsiblePerson?: string;
}

// Activity interface
export interface MinistryActivity {
  id: string;
  ministryId: string;
  title: string;
  description: string;
  scheduledDate: string;
  duration: number; // in hours
  location?: string;
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: string;
    dayOfMonth?: number;
    endDate?: string;
  };
  participants: {
    participantId: string;
    role: string;
    confirmed: boolean;
  }[];
  resources: string[]; // resource IDs
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Main Ministry interface
export interface Ministry {
  id: string;
  name: string;
  description: string;
  type: MinistryType;
  status: MinistryStatus;
  priority: MinistryPriority;
  leaders: MinistryParticipant[];
  participants: MinistryParticipant[];
  totalParticipants: number;
  targetAudience: {
    ageRange?: {
      min?: number;
      max?: number;
    };
    gender?: 'male' | 'female' | 'mixed';
    demographics?: string[];
    specialNeeds?: string[];
  };
  goals: {
    id: string;
    description: string;
    targetDate?: string;
    isCompleted: boolean;
    progress: number; // 0-100
  }[];
  budget: {
    allocated: number;
    spent: number;
    remaining: number;
    currency: string;
    period: string; // e.g., 'yearly', 'quarterly'
  };
  resources: MinistryResource[];
  activities: MinistryActivity[];
  metrics: {
    participantGrowth: number;
    retentionRate: number;
    goalsCompleted: number;
    budgetUtilization: number;
    avgAttendance: number;
  };
  tags: string[];
  imageUrl?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  contactInfo: {
    primaryContact: string;
    email?: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Create/Update interfaces
export interface CreateMinistryData {
  name: string;
  description: string;
  type: MinistryType;
  status: MinistryStatus;
  priority: MinistryPriority;
  targetAudience?: {
    ageRange?: { min?: number; max?: number };
    gender?: 'male' | 'female' | 'mixed';
    demographics?: string[];
  };
  goals?: {
    description: string;
    targetDate?: string;
  }[];
  budget?: {
    allocated: number;
    currency: string;
    period: string;
  };
  contactInfo: {
    primaryContact: string;
    email?: string;
    phone?: string;
  };
  tags: string[];
  imageUrl?: string;
  website?: string;
}

export interface UpdateMinistryData extends Partial<CreateMinistryData> {}

// Participant management interfaces
export interface CreateParticipantData {
  name: string;
  email: string;
  phone?: string;
  role: ParticipantRole;
  skills?: string[];
  notes?: string;
}

export interface UpdateParticipantData extends Partial<CreateParticipantData> {
  isActive?: boolean;
}

// Resource management interfaces
export interface CreateResourceData {
  type: ResourceType;
  name: string;
  description: string;
  quantity?: number;
  cost?: number;
  location?: string;
  responsiblePerson?: string;
}

export interface UpdateResourceData extends Partial<CreateResourceData> {
  status?: 'available' | 'allocated' | 'in_use' | 'maintenance' | 'unavailable';
}

// Filter interfaces
export interface MinistryFilters {
  search?: string;
  type?: MinistryType[];
  status?: MinistryStatus[];
  priority?: MinistryPriority[];
  leaderId?: string;
  minParticipants?: number;
  maxParticipants?: number;
  budgetMin?: number;
  budgetMax?: number;
  tags?: string[];
  dateCreatedFrom?: string;
  dateCreatedTo?: string;
}

// Statistics interface
export interface MinistryStats {
  total: {
    count: number;
    activeCount: number;
    inactiveCount: number;
  };
  byType: {
    [key in MinistryType]: number;
  };
  byStatus: {
    [key in MinistryStatus]: number;
  };
  byPriority: {
    [key in MinistryPriority]: number;
  };
  participation: {
    totalParticipants: number;
    totalLeaders: number;
    avgParticipantsPerMinistry: number;
    participantGrowthRate: number;
  };
  budget: {
    totalAllocated: number;
    totalSpent: number;
    avgUtilization: number;
    totalRemaining: number;
  };
  activities: {
    totalActivities: number;
    completedActivities: number;
    upcomingActivities: number;
    completionRate: number;
  };
  topPerforming: {
    ministry: Ministry;
    participantCount: number;
    goalsCompleted: number;
    budgetEfficiency: number;
  }[];
  recentActivity: {
    newMinistries: number;
    newParticipants: number;
    completedGoals: number;
    recentActivities: number;
  };
}

// Configuration objects
export const MINISTRY_TYPE_CONFIG: Record<MinistryType, { label: string; icon: string; color: string; description: string }> = {
  worship: { label: 'Worship', icon: '🙏', color: 'bg-purple-100 text-purple-800', description: 'Leading worship services and music ministry' },
  youth: { label: 'Youth', icon: '👨‍🎓', color: 'bg-blue-100 text-blue-800', description: 'Programs for teenagers and young adults' },
  children: { label: 'Children', icon: '👶', color: 'bg-yellow-100 text-yellow-800', description: 'Ministry to children and families' },
  seniors: { label: 'Seniors', icon: '👴', color: 'bg-gray-100 text-gray-800', description: 'Programs for senior members' },
  mens: { label: "Men's", icon: '👨', color: 'bg-indigo-100 text-indigo-800', description: 'Ministry focused on men' },
  womens: { label: "Women's", icon: '👩', color: 'bg-pink-100 text-pink-800', description: 'Ministry focused on women' },
  missions: { label: 'Missions', icon: '🌍', color: 'bg-green-100 text-green-800', description: 'Local and global mission work' },
  evangelism: { label: 'Evangelism', icon: '📢', color: 'bg-orange-100 text-orange-800', description: 'Sharing the gospel and outreach' },
  discipleship: { label: 'Discipleship', icon: '📖', color: 'bg-teal-100 text-teal-800', description: 'Spiritual growth and mentorship' },
  pastoral_care: { label: 'Pastoral Care', icon: '🤝', color: 'bg-emerald-100 text-emerald-800', description: 'Caring for congregation needs' },
  music: { label: 'Music', icon: '🎵', color: 'bg-violet-100 text-violet-800', description: 'Music ministry and choir' },
  media_tech: { label: 'Media & Tech', icon: '📱', color: 'bg-cyan-100 text-cyan-800', description: 'Technology and media production' },
  hospitality: { label: 'Hospitality', icon: '☕', color: 'bg-amber-100 text-amber-800', description: 'Welcome and hospitality services' },
  community_outreach: { label: 'Community Outreach', icon: '🏘️', color: 'bg-lime-100 text-lime-800', description: 'Serving the local community' },
  education: { label: 'Education', icon: '🎓', color: 'bg-blue-100 text-blue-800', description: 'Teaching and educational programs' },
  sports_recreation: { label: 'Sports & Recreation', icon: '⚽', color: 'bg-green-100 text-green-800', description: 'Sports and recreational activities' },
  marriage_family: { label: 'Marriage & Family', icon: '👨‍👩‍👧‍👦', color: 'bg-rose-100 text-rose-800', description: 'Supporting marriages and families' },
  prayer_intercession: { label: 'Prayer & Intercession', icon: '🙏', color: 'bg-purple-100 text-purple-800', description: 'Prayer ministry and intercession' },
  administration: { label: 'Administration', icon: '📋', color: 'bg-gray-100 text-gray-800', description: 'Administrative support and management' },
  facilities: { label: 'Facilities', icon: '🏢', color: 'bg-stone-100 text-stone-800', description: 'Building and facility management' }
};

export const MINISTRY_STATUS_CONFIG: Record<MinistryStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  planning: { label: 'Planning', color: 'bg-blue-100 text-blue-800' },
  on_hold: { label: 'On Hold', color: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Completed', color: 'bg-purple-100 text-purple-800' }
};

export const MINISTRY_PRIORITY_CONFIG: Record<MinistryPriority, { label: string; color: string }> = {
  high: { label: 'High', color: 'bg-red-100 text-red-800' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  low: { label: 'Low', color: 'bg-green-100 text-green-800' }
};

export const PARTICIPANT_ROLE_CONFIG: Record<ParticipantRole, { label: string; color: string }> = {
  leader: { label: 'Leader', color: 'bg-red-100 text-red-800' },
  co_leader: { label: 'Co-Leader', color: 'bg-orange-100 text-orange-800' },
  coordinator: { label: 'Coordinator', color: 'bg-blue-100 text-blue-800' },
  volunteer: { label: 'Volunteer', color: 'bg-green-100 text-green-800' },
  participant: { label: 'Participant', color: 'bg-gray-100 text-gray-800' },
  visitor: { label: 'Visitor', color: 'bg-purple-100 text-purple-800' }
};

export const RESOURCE_TYPE_CONFIG: Record<ResourceType, { label: string; icon: string }> = {
  budget: { label: 'Budget', icon: '💰' },
  equipment: { label: 'Equipment', icon: '🔧' },
  materials: { label: 'Materials', icon: '📦' },
  facility: { label: 'Facility', icon: '🏢' },
  personnel: { label: 'Personnel', icon: '👥' },
  training: { label: 'Training', icon: '📚' }
};
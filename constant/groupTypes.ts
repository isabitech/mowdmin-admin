// Group Types and Interfaces
export type GroupType = 
  | 'small_group'
  | 'ministry_team'
  | 'committee'
  | 'bible_study'
  | 'youth_group'
  | 'mens_group'
  | 'womens_group'
  | 'childrens_group'
  | 'seniors_group'
  | 'prayer_group'
  | 'worship_team'
  | 'volunteer_team'
  | 'leadership_team'
  | 'special_interest';

export type GroupStatus = 
  | 'active'
  | 'inactive'
  | 'on_hold'
  | 'planning'
  | 'completed';

export type MembershipStatus = 
  | 'active'
  | 'inactive'
  | 'pending'
  | 'invited'
  | 'left'
  | 'removed';

export type MemberRole = 
  | 'leader'
  | 'co_leader'
  | 'facilitator'
  | 'member'
  | 'visitor';

export type MeetingFrequency = 
  | 'weekly'
  | 'bi_weekly'
  | 'monthly'
  | 'quarterly'
  | 'as_needed'
  | 'special_events';

export type MeetingDay = 
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

// Member interface
export interface GroupMember {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  role: MemberRole;
  membershipStatus: MembershipStatus;
  joinedAt: string;
  leftAt?: string;
  isLeader: boolean;
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: {
    communicationMethod: 'email' | 'phone' | 'text';
    availableDays: MeetingDay[];
    specialNeeds?: string;
  };
}

// Meeting interface
export interface GroupMeeting {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  scheduledDate: string;
  duration: number; // in minutes
  location?: string;
  isVirtual: boolean;
  virtualLink?: string;
  agenda?: string;
  notes?: string;
  attendance: {
    memberId: string;
    status: 'present' | 'absent' | 'excused';
    checkedInAt?: string;
    notes?: string;
  }[];
  resources?: {
    title: string;
    url: string;
    type: 'document' | 'video' | 'audio' | 'link';
  }[];
  createdAt: string;
  updatedAt: string;
}

// Main Group interface
export interface Group {
  id: string;
  name: string;
  description: string;
  type: GroupType;
  status: GroupStatus;
  isPublic: boolean;
  maxMembers?: number;
  currentMemberCount: number;
  leaders: GroupMember[];
  members: GroupMember[];
  meetingSchedule: {
    frequency: MeetingFrequency;
    dayOfWeek?: MeetingDay;
    timeOfDay?: string;
    duration?: number;
    location?: string;
    isVirtual: boolean;
    virtualPlatform?: string;
  };
  contactInfo: {
    primaryContact: string;
    email?: string;
    phone?: string;
  };
  requirements?: {
    ageRange?: {
      min?: number;
      max?: number;
    };
    gender?: 'male' | 'female' | 'mixed';
    membershipRequired?: boolean;
    prerequisites?: string[];
  };
  resources?: {
    materials?: string[];
    budget?: number;
    equipment?: string[];
  };
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  statistics: {
    totalMeetings: number;
    averageAttendance: number;
    retentionRate: number;
    growthRate: number;
  };
}

// Create/Update interfaces
export interface CreateGroupData {
  name: string;
  description: string;
  type: GroupType;
  status: GroupStatus;
  isPublic: boolean;
  maxMembers?: number;
  meetingSchedule: {
    frequency: MeetingFrequency;
    dayOfWeek?: MeetingDay;
    timeOfDay?: string;
    duration?: number;
    location?: string;
    isVirtual: boolean;
    virtualPlatform?: string;
  };
  contactInfo: {
    primaryContact: string;
    email?: string;
    phone?: string;
  };
  requirements?: {
    ageRange?: {
      min?: number;
      max?: number;
    };
    gender?: 'male' | 'female' | 'mixed';
    membershipRequired?: boolean;
    prerequisites?: string[];
  };
  tags: string[];
  imageUrl?: string;
}

export interface UpdateGroupData extends Partial<CreateGroupData> {}

// Member management interfaces
export interface CreateMemberData {
  name: string;
  email: string;
  phone?: string;
  role: MemberRole;
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: {
    communicationMethod: 'email' | 'phone' | 'text';
    availableDays: MeetingDay[];
    specialNeeds?: string;
  };
}

export interface UpdateMemberData extends Partial<CreateMemberData> {
  membershipStatus?: MembershipStatus;
}

// Meeting management interfaces
export interface CreateMeetingData {
  title: string;
  description?: string;
  scheduledDate: string;
  duration: number;
  location?: string;
  isVirtual: boolean;
  virtualLink?: string;
  agenda?: string;
  resources?: {
    title: string;
    url: string;
    type: 'document' | 'video' | 'audio' | 'link';
  }[];
}

export interface UpdateMeetingData extends Partial<CreateMeetingData> {
  notes?: string;
}

// Filter interfaces
export interface GroupFilters {
  search?: string;
  type?: GroupType[];
  status?: GroupStatus[];
  isPublic?: boolean;
  hasOpenSpots?: boolean;
  meetingDay?: MeetingDay[];
  minMembers?: number;
  maxMembers?: number;
  tags?: string[];
  leaderId?: string;
  dateCreatedFrom?: string;
  dateCreatedTo?: string;
}

export interface MemberFilters {
  search?: string;
  role?: MemberRole[];
  status?: MembershipStatus[];
  joinedFrom?: string;
  joinedTo?: string;
  isLeader?: boolean;
}

// Statistics interfaces
export interface GroupStats {
  total: {
    count: number;
    activeCount: number;
    inactiveCount: number;
  };
  byType: {
    [key in GroupType]: number;
  };
  byStatus: {
    [key in GroupStatus]: number;
  };
  membership: {
    totalMembers: number;
    averageMembersPerGroup: number;
    totalLeaders: number;
    membershipGrowth: number;
  };
  meetings: {
    totalMeetingsThisMonth: number;
    averageAttendance: number;
    upcomingMeetings: number;
  };
  topGroups: {
    group: Group;
    memberCount: number;
    attendanceRate: number;
  }[];
  recentActivity: {
    newGroups: number;
    newMembers: number;
    completedMeetings: number;
  };
}

// Configuration objects
export const GROUP_TYPE_CONFIG: Record<GroupType, { label: string; icon: string; color: string; description: string }> = {
  small_group: {
    label: 'Small Group',
    icon: '👥',
    color: 'bg-blue-100 text-blue-800',
    description: 'Intimate fellowship and Bible study groups'
  },
  ministry_team: {
    label: 'Ministry Team',
    icon: '🤝',
    color: 'bg-green-100 text-green-800',
    description: 'Teams serving in specific ministry areas'
  },
  committee: {
    label: 'Committee',
    icon: '📋',
    color: 'bg-purple-100 text-purple-800',
    description: 'Administrative and decision-making committees'
  },
  bible_study: {
    label: 'Bible Study',
    icon: '📖',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Focused Scripture study groups'
  },
  youth_group: {
    label: 'Youth Group',
    icon: '🧑‍🎓',
    color: 'bg-orange-100 text-orange-800',
    description: 'Groups for teenagers and young adults'
  },
  mens_group: {
    label: 'Men\'s Group',
    icon: '👨',
    color: 'bg-indigo-100 text-indigo-800',
    description: 'Fellowship and support for men'
  },
  womens_group: {
    label: 'Women\'s Group',
    icon: '👩',
    color: 'bg-pink-100 text-pink-800',
    description: 'Fellowship and support for women'
  },
  childrens_group: {
    label: 'Children\'s Group',
    icon: '🧒',
    color: 'bg-red-100 text-red-800',
    description: 'Activities and programs for children'
  },
  seniors_group: {
    label: 'Seniors Group',
    icon: '👴',
    color: 'bg-gray-100 text-gray-800',
    description: 'Fellowship and activities for seniors'
  },
  prayer_group: {
    label: 'Prayer Group',
    icon: '🙏',
    color: 'bg-teal-100 text-teal-800',
    description: 'Dedicated intercession and prayer meetings'
  },
  worship_team: {
    label: 'Worship Team',
    icon: '🎵',
    color: 'bg-violet-100 text-violet-800',
    description: 'Musicians and singers for worship services'
  },
  volunteer_team: {
    label: 'Volunteer Team',
    icon: '🤲',
    color: 'bg-emerald-100 text-emerald-800',
    description: 'Service and volunteer coordination teams'
  },
  leadership_team: {
    label: 'Leadership Team',
    icon: '👑',
    color: 'bg-amber-100 text-amber-800',
    description: 'Church leadership and governance groups'
  },
  special_interest: {
    label: 'Special Interest',
    icon: '🌟',
    color: 'bg-cyan-100 text-cyan-800',
    description: 'Groups based on shared interests or hobbies'
  }
};

export const GROUP_STATUS_CONFIG: Record<GroupStatus, { label: string; color: string; description: string }> = {
  active: {
    label: 'Active',
    color: 'bg-green-100 text-green-800',
    description: 'Group is currently meeting regularly'
  },
  inactive: {
    label: 'Inactive',
    color: 'bg-gray-100 text-gray-800',
    description: 'Group is not currently meeting'
  },
  on_hold: {
    label: 'On Hold',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Group is temporarily paused'
  },
  planning: {
    label: 'Planning',
    color: 'bg-blue-100 text-blue-800',
    description: 'Group is being organized'
  },
  completed: {
    label: 'Completed',
    color: 'bg-purple-100 text-purple-800',
    description: 'Group has finished its purpose'
  }
};

export const MEMBER_ROLE_CONFIG: Record<MemberRole, { label: string; color: string; description: string }> = {
  leader: {
    label: 'Leader',
    color: 'bg-red-100 text-red-800',
    description: 'Primary group leader'
  },
  co_leader: {
    label: 'Co-Leader',
    color: 'bg-orange-100 text-orange-800',
    description: 'Assistant group leader'
  },
  facilitator: {
    label: 'Facilitator',
    color: 'bg-blue-100 text-blue-800',
    description: 'Meeting facilitator or coordinator'
  },
  member: {
    label: 'Member',
    color: 'bg-green-100 text-green-800',
    description: 'Regular group member'
  },
  visitor: {
    label: 'Visitor',
    color: 'bg-gray-100 text-gray-800',
    description: 'Occasional visitor or guest'
  }
};

export const MEMBERSHIP_STATUS_CONFIG: Record<MembershipStatus, { label: string; color: string }> = {
  active: {
    label: 'Active',
    color: 'bg-green-100 text-green-800'
  },
  inactive: {
    label: 'Inactive',
    color: 'bg-gray-100 text-gray-800'
  },
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800'
  },
  invited: {
    label: 'Invited',
    color: 'bg-blue-100 text-blue-800'
  },
  left: {
    label: 'Left',
    color: 'bg-orange-100 text-orange-800'
  },
  removed: {
    label: 'Removed',
    color: 'bg-red-100 text-red-800'
  }
};

export const MEETING_FREQUENCY_CONFIG: Record<MeetingFrequency, { label: string; icon: string }> = {
  weekly: { label: 'Weekly', icon: '📅' },
  bi_weekly: { label: 'Bi-weekly', icon: '📆' },
  monthly: { label: 'Monthly', icon: '🗓️' },
  quarterly: { label: 'Quarterly', icon: '📊' },
  as_needed: { label: 'As Needed', icon: '🔄' },
  special_events: { label: 'Special Events', icon: '🎉' }
};

export const MEETING_DAY_CONFIG: Record<MeetingDay, { label: string; short: string }> = {
  sunday: { label: 'Sunday', short: 'Sun' },
  monday: { label: 'Monday', short: 'Mon' },
  tuesday: { label: 'Tuesday', short: 'Tue' },
  wednesday: { label: 'Wednesday', short: 'Wed' },
  thursday: { label: 'Thursday', short: 'Thu' },
  friday: { label: 'Friday', short: 'Fri' },
  saturday: { label: 'Saturday', short: 'Sat' }
};
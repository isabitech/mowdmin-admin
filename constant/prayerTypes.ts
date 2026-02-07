// Prayer types
export interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'answered' | 'archived';
  isAnonymous?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PrayerPoint {
  id: string;
  title: string;
  description?: string;
  prayerRequestId?: string;
  prayerRequest?: PrayerRequest;
  category: 'healing' | 'guidance' | 'thanksgiving' | 'protection' | 'provision' | 'salvation' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrayerRequestRequest {
  title: string;
  description: string;
  isAnonymous?: boolean;
}

export interface CreatePrayerPointRequest {
  title: string;
  description?: string;
  prayerRequestId?: string;
  category: 'healing' | 'guidance' | 'thanksgiving' | 'protection' | 'provision' | 'salvation' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UpdatePrayerPointRequest extends Partial<CreatePrayerPointRequest> {
  id: string;
  isActive?: boolean;
}
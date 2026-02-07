// Event types
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  type: 'Crusade' | 'Baptism' | 'Conference' | 'Service' | 'Prayer' | 'Other';
  image?: string;
  capacity?: number;
  registeredCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  type: 'Crusade' | 'Baptism' | 'Conference' | 'Service' | 'Prayer' | 'Other';
  capacity?: number;
  image?: File;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
  isActive?: boolean;
}
// Media types
export interface Media {
  _id: string;
  title: string;
  description?: string;
  url?: string;
  category_id?: MediaCategory;
  categoryId?: string;
  youtubeLiveLink?: string;
  isLive: boolean;
  isActive?: boolean;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface MediaCategory {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateMediaRequest {
  title: string;
  description?: string;
  url: string;
  categoryId?: string;
  youtubeLiveLink?: string;
  isLive?: boolean;
}

export interface UpdateMediaRequest extends Partial<CreateMediaRequest> {
  id: string;
  isActive?: boolean;
}
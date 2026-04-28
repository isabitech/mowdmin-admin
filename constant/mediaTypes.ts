// Media types
export interface Media {
  _id: string;
  title: string;
  description?: string;
  url?: string;
  category_id?: MediaCategory;
  // categoryId?: string;
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
  category_id?: string;
  type: string;
  media_url: string;
  author?: string;
  duration?: string;
  is_downloadable?: boolean;
  thumbnail?: string;
  thumbnailFile?: File | null;
  isLive?: boolean;
}

export interface UpdateMediaRequest extends Partial<CreateMediaRequest> {
  id: string;
  isActive?: boolean;
}

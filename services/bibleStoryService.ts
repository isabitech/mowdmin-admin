import { endpoints } from '@/constant/endpoints';
import {
  BibleStory,
  CreateBibleStoryData,
  UpdateBibleStoryData,
  BibleStoryFilters,
  BibleStoryStats,
  BibleStoryAnalytics,
  BibleStoryQuestion,
  BibleStoryActivity,
} from '@/constant/bibleStoryTypes';
import axios from 'axios';

class BibleStoryService {
  // Story CRUD operations
  async getBibleStories(
    page: number = 1,
    limit: number = 20,
    filters?: BibleStoryFilters
  ): Promise<{ data: BibleStory[]; pagination: any }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await axios.get(`${endpoints.bibleStories.list}?${params}`);
    return response.data;
  }

  async getBibleStoryById(id: string): Promise<BibleStory> {
    const response = await axios.get(endpoints.bibleStories.detail(id));
    return response.data.data;
  }

  async createBibleStory(storyData: CreateBibleStoryData): Promise<BibleStory> {
    const response = await axios.post(endpoints.bibleStories.create, storyData);
    return response.data.data;
  }

  async updateBibleStory(id: string, storyData: UpdateBibleStoryData): Promise<BibleStory> {
    const response = await axios.put(endpoints.bibleStories.update(id), storyData);
    return response.data.data;
  }

  async deleteBibleStory(id: string): Promise<void> {
    await axios.delete(endpoints.bibleStories.delete(id));
  }

  // Bulk operations
  async bulkDeleteBibleStories(ids: string[]): Promise<void> {
    await axios.delete(endpoints.bibleStories.bulkDelete, {
      data: { ids }
    });
  }

  async bulkUpdateBibleStories(updates: { id: string; data: Partial<UpdateBibleStoryData> }[]): Promise<BibleStory[]> {
    const response = await axios.put(endpoints.bibleStories.bulkUpdate, { updates });
    return response.data.data;
  }

  // Story interactions
  async likeBibleStory(id: string): Promise<void> {
    await axios.post(endpoints.bibleStories.like(id));
  }

  async unlikeBibleStory(id: string): Promise<void> {
    await axios.delete(endpoints.bibleStories.unlike(id));
  }

  async incrementViews(id: string): Promise<void> {
    await axios.post(endpoints.bibleStories.incrementViews(id));
  }

  // Questions management
  async addQuestionToStory(storyId: string, question: Omit<BibleStoryQuestion, 'id'>): Promise<BibleStoryQuestion> {
    const response = await axios.post(
      endpoints.bibleStories.addQuestion(storyId),
      question
    );
    return response.data.data;
  }

  async updateStoryQuestion(storyId: string, questionId: string, question: Partial<BibleStoryQuestion>): Promise<BibleStoryQuestion> {
    const response = await axios.put(
      endpoints.bibleStories.updateQuestion(storyId, questionId),
      question
    );
    return response.data.data;
  }

  async deleteStoryQuestion(storyId: string, questionId: string): Promise<void> {
    await axios.delete(
      endpoints.bibleStories.deleteQuestion(storyId, questionId)
    );
  }

  // Activities management
  async addActivityToStory(storyId: string, activity: Omit<BibleStoryActivity, 'id'>): Promise<BibleStoryActivity> {
    const response = await axios.post(
      endpoints.bibleStories.addActivity(storyId),
      activity
    );
    return response.data.data;
  }

  async updateStoryActivity(storyId: string, activityId: string, activity: Partial<BibleStoryActivity>): Promise<BibleStoryActivity> {
    const response = await axios.put(
      endpoints.bibleStories.updateActivity(storyId, activityId),
      activity
    );
    return response.data.data;
  }

  async deleteStoryActivity(storyId: string, activityId: string): Promise<void> {
    await axios.delete(
      endpoints.bibleStories.deleteActivity(storyId, activityId)
    );
  }

  // Media management
  async uploadStoryImage(id: string, file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post(
      endpoints.bibleStories.uploadImage(id),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.data;
  }

  async uploadStoryAudio(id: string, file: File): Promise<{ audioUrl: string }> {
    const formData = new FormData();
    formData.append('audio', file);
    
    const response = await axios.post(
      endpoints.bibleStories.uploadAudio(id),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.data;
  }

  async uploadStoryVideo(id: string, file: File): Promise<{ videoUrl: string }> {
    const formData = new FormData();
    formData.append('video', file);
    
    const response = await axios.post(
      endpoints.bibleStories.uploadVideo(id),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.data;
  }

  // Statistics and analytics
  async getBibleStoryStats(): Promise<BibleStoryStats> {
    const response = await axios.get(endpoints.bibleStories.stats);
    return response.data.data;
  }

  async getBibleStoryAnalytics(dateFrom?: string, dateTo?: string): Promise<BibleStoryAnalytics> {
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const response = await axios.get(`${endpoints.bibleStories.analytics}?${params}`);
    return response.data.data;
  }

  // Search and discovery
  async searchBibleStories(
    query: string,
    filters?: Partial<BibleStoryFilters>
  ): Promise<BibleStory[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    const response = await axios.get(`${endpoints.bibleStories.search}?${params}`);
    return response.data.data;
  }

  async getFeaturedStories(): Promise<BibleStory[]> {
    const response = await axios.get(endpoints.bibleStories.featured);
    return response.data.data;
  }

  async getPopularStories(limit: number = 10): Promise<BibleStory[]> {
    const response = await axios.get(`${endpoints.bibleStories.popular}?limit=${limit}`);
    return response.data.data;
  }

  async getRecentStories(limit: number = 10): Promise<BibleStory[]> {
    const response = await axios.get(`${endpoints.bibleStories.recent}?limit=${limit}`);
    return response.data.data;
  }

  async getRelatedStories(storyId: string, limit: number = 5): Promise<BibleStory[]> {
    const response = await axios.get(`${endpoints.bibleStories.related(storyId)}?limit=${limit}`);
    return response.data.data;
  }

  // Category and filtering helpers
  async getStoriesByCategory(category: string, page: number = 1, limit: number = 20): Promise<{ data: BibleStory[]; pagination: any }> {
    const response = await axios.get(
      `${endpoints.bibleStories.byCategory(category)}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getStoriesByAgeGroup(ageGroup: string, page: number = 1, limit: number = 20): Promise<{ data: BibleStory[]; pagination: any }> {
    const response = await axios.get(
      `${endpoints.bibleStories.byAgeGroup(ageGroup)}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getStoriesByDifficulty(difficulty: string, page: number = 1, limit: number = 20): Promise<{ data: BibleStory[]; pagination: any }> {
    const response = await axios.get(
      `${endpoints.bibleStories.byDifficulty(difficulty)}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Export and import
  async exportStories(format: 'pdf' | 'docx' | 'json' = 'json', filters?: BibleStoryFilters): Promise<Blob> {
    const params = new URLSearchParams();
    params.append('format', format);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    const response = await axios.get(`${endpoints.bibleStories.export}?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async importStories(file: File): Promise<{ imported: number; failed: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(endpoints.bibleStories.import, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  // Tags management
  async getAvailableTags(): Promise<string[]> {
    const response = await axios.get(endpoints.bibleStories.tags);
    return response.data.data;
  }

  async addTag(storyId: string, tag: string): Promise<void> {
    await axios.post(endpoints.bibleStories.addTag(storyId), { tag });
  }

  async removeTag(storyId: string, tag: string): Promise<void> {
    await axios.delete(endpoints.bibleStories.removeTag(storyId), {
      data: { tag }
    });
  }
}

export const bibleStoryService = new BibleStoryService();
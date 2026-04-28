import { endpoints } from '@/constant/endpoints';
import {
  BibleStory,
  CreateBibleStoryData,
  UpdateBibleStoryData,
  BibleStoryFilters,
  BibleStoryAnalytics,
  BibleStoryQuestion,
  BibleStoryActivity,
} from '@/constant/bibleStoryTypes';
import api from './authService';

type BibleStoryApi = Partial<BibleStory> & { _id?: string };
type BibleStoryQuestionApi = Partial<BibleStoryQuestion> & { _id?: string };
type BibleStoryActivityApi = Partial<BibleStoryActivity> & { _id?: string };

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const toAgeGroupArray = (value: unknown): BibleStory['ageGroups'] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is BibleStory['ageGroups'][number] => typeof item === 'string'
      )
    : [];

const toNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const toIsoDateString = (value: unknown): string => {
  const parsedDate =
    value instanceof Date ? value : new Date(typeof value === 'string' ? value : Date.now());

  return Number.isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
};

const normalizeQuestion = (
  question: BibleStoryQuestionApi | null | undefined,
  index: number
): BibleStoryQuestion => ({
  id: question?.id ?? question?._id ?? `question-${index}`,
  question: question?.question ?? '',
  type: question?.type ?? 'open-ended',
  options: toStringArray(question?.options),
  correctAnswer: typeof question?.correctAnswer === 'string' ? question.correctAnswer : undefined,
  explanation: typeof question?.explanation === 'string' ? question.explanation : undefined,
  difficulty: question?.difficulty ?? 'beginner',
});

const normalizeActivity = (
  activity: BibleStoryActivityApi | null | undefined,
  index: number
): BibleStoryActivity => ({
  id: activity?.id ?? activity?._id ?? `activity-${index}`,
  title: activity?.title ?? '',
  description: activity?.description ?? '',
  type: activity?.type ?? 'discussion',
  materials: toStringArray(activity?.materials),
  duration: toNumber(activity?.duration),
  instructions: toStringArray(activity?.instructions),
  ageGroups: toAgeGroupArray(activity?.ageGroups),
});

const normalizeBibleStory = (
  story: BibleStoryApi | null | undefined,
  index: number = 0
): BibleStory => ({
  id: story?.id ?? story?._id ?? `story-${index}`,
  title: story?.title ?? 'Untitled Story',
  summary: story?.summary ?? '',
  content: story?.content ?? '',
  book: story?.book ?? '',
  chapter: toNumber(story?.chapter),
  verseStart: toNumber(story?.verseStart),
  verseEnd: toNumber(story?.verseEnd),
  category: story?.category ?? 'old_testament',
  tags: toStringArray(story?.tags),
  ageGroups: toAgeGroupArray(story?.ageGroups),
  difficulty: story?.difficulty ?? 'beginner',
  lessonPoints: toStringArray(story?.lessonPoints),
  moralLesson: story?.moralLesson ?? '',
  questions: Array.isArray(story?.questions)
    ? story.questions.map((question, questionIndex) => normalizeQuestion(question, questionIndex))
    : [],
  activities: Array.isArray(story?.activities)
    ? story.activities.map((activity, activityIndex) => normalizeActivity(activity, activityIndex))
    : [],
  relatedStories: toStringArray(story?.relatedStories),
  audioUrl: story?.audioUrl || undefined,
  imageUrl: story?.imageUrl || undefined,
  videoUrl: story?.videoUrl || undefined,
  downloadable: Boolean(story?.downloadable),
  featured: Boolean(story?.featured),
  status: story?.status ?? 'draft',
  views: toNumber(story?.views),
  likes: toNumber(story?.likes),
  createdBy: story?.createdBy ?? '',
  createdAt: toIsoDateString(story?.createdAt),
  updatedAt: toIsoDateString(story?.updatedAt),
});

const normalizeBibleStoryList = (stories: unknown): BibleStory[] =>
  Array.isArray(stories)
    ? stories.map((story, index) => normalizeBibleStory(story as BibleStoryApi, index))
    : [];

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

    const response = await api.get(`${endpoints.bibleStories.list}?${params}`);
    return {
      ...response.data,
      data: normalizeBibleStoryList(response.data?.data),
      pagination: response.data?.pagination ?? {},
    };
  }

  async getBibleStoryById(id: string): Promise<BibleStory> {
    const response = await api.get(endpoints.bibleStories.detail(id));
    return normalizeBibleStory(response.data?.data);
  }

  async createBibleStory(storyData: CreateBibleStoryData): Promise<BibleStory> {
    const response = await api.post(endpoints.bibleStories.create, storyData);
    return normalizeBibleStory(response.data?.data);
  }

  async updateBibleStory(id: string, storyData: UpdateBibleStoryData): Promise<BibleStory> {
    const response = await api.put(endpoints.bibleStories.update(id), storyData);
    return normalizeBibleStory(response.data?.data);
  }

  async deleteBibleStory(id: string): Promise<void> {
    await api.delete(endpoints.bibleStories.delete(id));
  }

  // Bulk operations
  async bulkDeleteBibleStories(ids: string[]): Promise<void> {
    await api.delete(endpoints.bibleStories.bulkDelete, {
      data: { ids }
    });
  }

  async bulkUpdateBibleStories(updates: { id: string; data: Partial<UpdateBibleStoryData> }[]): Promise<BibleStory[]> {
    const response = await api.put(endpoints.bibleStories.bulkUpdate, { updates });
    return normalizeBibleStoryList(response.data?.data);
  }

  // Story interactions
  async likeBibleStory(id: string): Promise<void> {
    await api.post(endpoints.bibleStories.like(id));
  }

  async unlikeBibleStory(id: string): Promise<void> {
    await api.delete(endpoints.bibleStories.unlike(id));
  }

  async incrementViews(id: string): Promise<void> {
    await api.post(endpoints.bibleStories.incrementViews(id));
  }

  // Questions management
  async addQuestionToStory(storyId: string, question: Omit<BibleStoryQuestion, 'id'>): Promise<BibleStoryQuestion> {
    const response = await api.post(
      endpoints.bibleStories.addQuestion(storyId),
      question
    );
    return response.data.data;
  }

  async updateStoryQuestion(storyId: string, questionId: string, question: Partial<BibleStoryQuestion>): Promise<BibleStoryQuestion> {
    const response = await api.put(
      endpoints.bibleStories.updateQuestion(storyId, questionId),
      question
    );
    return response.data.data;
  }

  async deleteStoryQuestion(storyId: string, questionId: string): Promise<void> {
    await api.delete(
      endpoints.bibleStories.deleteQuestion(storyId, questionId)
    );
  }

  // Activities management
  async addActivityToStory(storyId: string, activity: Omit<BibleStoryActivity, 'id'>): Promise<BibleStoryActivity> {
    const response = await api.post(
      endpoints.bibleStories.addActivity(storyId),
      activity
    );
    return response.data.data;
  }

  async updateStoryActivity(storyId: string, activityId: string, activity: Partial<BibleStoryActivity>): Promise<BibleStoryActivity> {
    const response = await api.put(
      endpoints.bibleStories.updateActivity(storyId, activityId),
      activity
    );
    return response.data.data;
  }

  async deleteStoryActivity(storyId: string, activityId: string): Promise<void> {
    await api.delete(
      endpoints.bibleStories.deleteActivity(storyId, activityId)
    );
  }

  // Media management
  async uploadStoryImage(id: string, file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post(
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
    
    const response = await api.post(
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
    
    const response = await api.post(
      endpoints.bibleStories.uploadVideo(id),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.data;
  }

  async getBibleStoryAnalytics(dateFrom?: string, dateTo?: string): Promise<BibleStoryAnalytics> {
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const response = await api.get(`${endpoints.bibleStories.analytics}?${params}`);
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
    
    const response = await api.get(`${endpoints.bibleStories.search}?${params}`);
    return normalizeBibleStoryList(response.data?.data);
  }

  async getFeaturedStories(): Promise<BibleStory[]> {
    const response = await api.get(endpoints.bibleStories.featured);
    return normalizeBibleStoryList(response.data?.data);
  }

  async getPopularStories(limit: number = 10): Promise<BibleStory[]> {
    const response = await api.get(`${endpoints.bibleStories.popular}?limit=${limit}`);
    return normalizeBibleStoryList(response.data?.data);
  }

  async getRecentStories(limit: number = 10): Promise<BibleStory[]> {
    const response = await api.get(`${endpoints.bibleStories.recent}?limit=${limit}`);
    return normalizeBibleStoryList(response.data?.data);
  }

  async getRelatedStories(storyId: string, limit: number = 5): Promise<BibleStory[]> {
    const response = await api.get(`${endpoints.bibleStories.related(storyId)}?limit=${limit}`);
    return normalizeBibleStoryList(response.data?.data);
  }

  // Category and filtering helpers
  async getStoriesByCategory(category: string, page: number = 1, limit: number = 20): Promise<{ data: BibleStory[]; pagination: any }> {
    const response = await api.get(
      `${endpoints.bibleStories.byCategory(category)}?page=${page}&limit=${limit}`
    );
    return {
      ...response.data,
      data: normalizeBibleStoryList(response.data?.data),
      pagination: response.data?.pagination ?? {},
    };
  }

  async getStoriesByAgeGroup(ageGroup: string, page: number = 1, limit: number = 20): Promise<{ data: BibleStory[]; pagination: any }> {
    const response = await api.get(
      `${endpoints.bibleStories.byAgeGroup(ageGroup)}?page=${page}&limit=${limit}`
    );
    return {
      ...response.data,
      data: normalizeBibleStoryList(response.data?.data),
      pagination: response.data?.pagination ?? {},
    };
  }

  async getStoriesByDifficulty(difficulty: string, page: number = 1, limit: number = 20): Promise<{ data: BibleStory[]; pagination: any }> {
    const response = await api.get(
      `${endpoints.bibleStories.byDifficulty(difficulty)}?page=${page}&limit=${limit}`
    );
    return {
      ...response.data,
      data: normalizeBibleStoryList(response.data?.data),
      pagination: response.data?.pagination ?? {},
    };
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
    
    const response = await api.get(`${endpoints.bibleStories.export}?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async importStories(file: File): Promise<{ imported: number; failed: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(endpoints.bibleStories.import, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  // Tags management
  async getAvailableTags(): Promise<string[]> {
    const response = await api.get(endpoints.bibleStories.tags);
    return response.data.data;
  }

  async addTag(storyId: string, tag: string): Promise<void> {
    await api.post(endpoints.bibleStories.addTag(storyId), { tag });
  }

  async removeTag(storyId: string, tag: string): Promise<void> {
    await api.delete(endpoints.bibleStories.removeTag(storyId), {
      data: { tag }
    });
  }
}

export const bibleStoryService = new BibleStoryService();

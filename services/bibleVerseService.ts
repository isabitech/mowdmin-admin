import { endpoints } from '@/constant/endpoints';
import {
  BibleVerse,
  VerseCollection,
  CreateBibleVerseData,
  UpdateBibleVerseData,
  CreateVerseCollectionData,
  UpdateVerseCollectionData,
  BibleVerseFilters,
  BibleVerseStats,
  BibleVerseAnalytics,
  CrossReference,
} from '@/constant/bibleVerseTypes';
import axios from 'axios';

class BibleVerseService {
  // Verse CRUD operations
  async getBibleVerses(
    page: number = 1,
    limit: number = 20,
    filters?: BibleVerseFilters
  ): Promise<{ data: BibleVerse[]; pagination: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await axios.get(`${endpoints.BIBLE_VERSES.GET_ALL}?${params}`);
    return response.data;
  }

  async getBibleVerseById(id: string): Promise<BibleVerse> {
    const response = await axios.get(endpoints.BIBLE_VERSES.GET_BY_ID.replace(':id', id));
    return response.data.data;
  }

  async createBibleVerse(verseData: CreateBibleVerseData): Promise<BibleVerse> {
    const response = await axios.post(endpoints.BIBLE_VERSES.CREATE, verseData);
    return response.data.data;
  }

  async updateBibleVerse(id: string, verseData: UpdateBibleVerseData): Promise<BibleVerse> {
    const response = await axios.put(endpoints.BIBLE_VERSES.UPDATE.replace(':id', id), verseData);
    return response.data.data;
  }

  async deleteBibleVerse(id: string): Promise<void> {
    await axios.delete(endpoints.BIBLE_VERSES.DELETE.replace(':id', id));
  }

  // Bulk operations
  async bulkDeleteBibleVerses(ids: string[]): Promise<void> {
    await axios.delete(endpoints.BIBLE_VERSES.BULK_DELETE, {
      data: { ids }
    });
  }

  async bulkUpdateBibleVerses(updates: { id: string; data: Partial<UpdateBibleVerseData> }[]): Promise<BibleVerse[]> {
    const response = await axios.put(endpoints.BIBLE_VERSES.BULK_UPDATE, { updates });
    return response.data.data;
  }

  async importVerses(file: File): Promise<{ imported: number; failed: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(endpoints.BIBLE_VERSES.IMPORT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  // Verse interactions
  async bookmarkVerse(id: string): Promise<void> {
    await axios.post(endpoints.BIBLE_VERSES.BOOKMARK.replace(':id', id));
  }

  async unbookmarkVerse(id: string): Promise<void> {
    await axios.delete(endpoints.BIBLE_VERSES.UNBOOKMARK.replace(':id', id));
  }

  async shareVerse(id: string): Promise<void> {
    await axios.post(endpoints.BIBLE_VERSES.SHARE.replace(':id', id));
  }

  async downloadVerse(id: string, format: 'pdf' | 'image' | 'text' = 'image'): Promise<Blob> {
    const response = await axios.get(
      `${endpoints.BIBLE_VERSES.DOWNLOAD.replace(':id', id)}?format=${format}`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  // Cross references
  async addCrossReference(verseId: string, crossRef: Omit<CrossReference, 'id'>): Promise<CrossReference> {
    const response = await axios.post(
      endpoints.BIBLE_VERSES.ADD_CROSS_REFERENCE.replace(':id', verseId),
      crossRef
    );
    return response.data.data;
  }

  async updateCrossReference(verseId: string, crossRefId: string, crossRef: Partial<CrossReference>): Promise<CrossReference> {
    const response = await axios.put(
      endpoints.BIBLE_VERSES.UPDATE_CROSS_REFERENCE.replace(':verseId', verseId).replace(':crossRefId', crossRefId),
      crossRef
    );
    return response.data.data;
  }

  async deleteCrossReference(verseId: string, crossRefId: string): Promise<void> {
    await axios.delete(
      endpoints.BIBLE_VERSES.DELETE_CROSS_REFERENCE.replace(':verseId', verseId).replace(':crossRefId', crossRefId)
    );
  }

  // Collection management
  async getVerseCollections(
    page: number = 1,
    limit: number = 20,
    filters?: any
  ): Promise<{ data: VerseCollection[]; pagination: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await axios.get(`${endpoints.BIBLE_VERSES.COLLECTIONS.GET_ALL}?${params}`);
    return response.data;
  }

  async getVerseCollectionById(id: string): Promise<VerseCollection> {
    const response = await axios.get(endpoints.BIBLE_VERSES.COLLECTIONS.GET_BY_ID.replace(':id', id));
    return response.data.data;
  }

  async createVerseCollection(collectionData: CreateVerseCollectionData): Promise<VerseCollection> {
    const response = await axios.post(endpoints.BIBLE_VERSES.COLLECTIONS.CREATE, collectionData);
    return response.data.data;
  }

  async updateVerseCollection(id: string, collectionData: UpdateVerseCollectionData): Promise<VerseCollection> {
    const response = await axios.put(endpoints.BIBLE_VERSES.COLLECTIONS.UPDATE.replace(':id', id), collectionData);
    return response.data.data;
  }

  async deleteVerseCollection(id: string): Promise<void> {
    await axios.delete(endpoints.BIBLE_VERSES.COLLECTIONS.DELETE.replace(':id', id));
  }

  async addVerseToCollection(collectionId: string, verseId: string): Promise<void> {
    await axios.post(
      endpoints.BIBLE_VERSES.COLLECTIONS.ADD_VERSE.replace(':collectionId', collectionId).replace(':verseId', verseId)
    );
  }

  async removeVerseFromCollection(collectionId: string, verseId: string): Promise<void> {
    await axios.delete(
      endpoints.BIBLE_VERSES.COLLECTIONS.REMOVE_VERSE.replace(':collectionId', collectionId).replace(':verseId', verseId)
    );
  }

  // Search and discovery
  async searchBibleVerses(
    query: string,
    filters?: Partial<BibleVerseFilters>
  ): Promise<BibleVerse[]> {
    const params = new URLSearchParams({
      q: query,
      ...filters,
    });
    
    const response = await axios.get(`${endpoints.BIBLE_VERSES.SEARCH}?${params}`);
    return response.data.data;
  }

  async getFeaturedVerses(): Promise<BibleVerse[]> {
    const response = await axios.get(endpoints.BIBLE_VERSES.FEATURED);
    return response.data.data;
  }

  async getPopularVerses(limit: number = 10): Promise<BibleVerse[]> {
    const response = await axios.get(`${endpoints.BIBLE_VERSES.POPULAR}?limit=${limit}`);
    return response.data.data;
  }

  async getRecentVerses(limit: number = 10): Promise<BibleVerse[]> {
    const response = await axios.get(`${endpoints.BIBLE_VERSES.RECENT}?limit=${limit}`);
    return response.data.data;
  }

  async getRandomVerse(): Promise<BibleVerse> {
    const response = await axios.get(endpoints.BIBLE_VERSES.RANDOM);
    return response.data.data;
  }

  async getVerseOfTheDay(): Promise<BibleVerse> {
    const response = await axios.get(endpoints.BIBLE_VERSES.VERSE_OF_THE_DAY);
    return response.data.data;
  }

  // Category and filtering helpers
  async getVersesByCategory(category: string, page: number = 1, limit: number = 20): Promise<{ data: BibleVerse[]; pagination: any }> {
    const response = await axios.get(
      `${endpoints.BIBLE_VERSES.BY_CATEGORY.replace(':category', category)}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getVersesByTheme(theme: string, page: number = 1, limit: number = 20): Promise<{ data: BibleVerse[]; pagination: any }> {
    const response = await axios.get(
      `${endpoints.BIBLE_VERSES.BY_THEME.replace(':theme', theme)}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getVersesByBook(book: string, chapter?: number): Promise<BibleVerse[]> {
    const params = chapter ? `?chapter=${chapter}` : '';
    const response = await axios.get(
      `${endpoints.BIBLE_VERSES.BY_BOOK.replace(':book', book)}${params}`
    );
    return response.data.data;
  }

  async getVersesByTranslation(translation: string, page: number = 1, limit: number = 20): Promise<{ data: BibleVerse[]; pagination: any }> {
    const response = await axios.get(
      `${endpoints.BIBLE_VERSES.BY_TRANSLATION.replace(':translation', translation)}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getMemoryVerses(level?: string): Promise<BibleVerse[]> {
    const params = level ? `?level=${level}` : '';
    const response = await axios.get(`${endpoints.BIBLE_VERSES.MEMORY_VERSES}${params}`);
    return response.data.data;
  }

  // Statistics and analytics
  async getBibleVerseStats(): Promise<BibleVerseStats> {
    const response = await axios.get(endpoints.BIBLE_VERSES.STATS);
    return response.data.data;
  }

  async getBibleVerseAnalytics(dateFrom?: string, dateTo?: string): Promise<BibleVerseAnalytics> {
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const response = await axios.get(`${endpoints.BIBLE_VERSES.ANALYTICS}?${params}`);
    return response.data.data;
  }

  // Export functionality
  async exportVerses(format: 'pdf' | 'docx' | 'json' | 'csv' = 'json', filters?: BibleVerseFilters): Promise<Blob> {
    const params = new URLSearchParams({ format, ...filters });
    
    const response = await axios.get(`${endpoints.BIBLE_VERSES.EXPORT}?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async exportCollection(collectionId: string, format: 'pdf' | 'docx' | 'json' = 'pdf'): Promise<Blob> {
    const response = await axios.get(
      `${endpoints.BIBLE_VERSES.COLLECTIONS.EXPORT.replace(':id', collectionId)}?format=${format}`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  // Tags and topics management
  async getAvailableTags(): Promise<string[]> {
    const response = await axios.get(endpoints.BIBLE_VERSES.TAGS);
    return response.data.data;
  }

  async getAvailableTopics(): Promise<string[]> {
    const response = await axios.get(endpoints.BIBLE_VERSES.TOPICS);
    return response.data.data;
  }

  async addTag(verseId: string, tag: string): Promise<void> {
    await axios.post(endpoints.BIBLE_VERSES.ADD_TAG.replace(':id', verseId), { tag });
  }

  async removeTag(verseId: string, tag: string): Promise<void> {
    await axios.delete(endpoints.BIBLE_VERSES.REMOVE_TAG.replace(':id', verseId), {
      data: { tag }
    });
  }

  async addTopic(verseId: string, topic: string): Promise<void> {
    await axios.post(endpoints.BIBLE_VERSES.ADD_TOPIC.replace(':id', verseId), { topic });
  }

  async removeTopic(verseId: string, topic: string): Promise<void> {
    await axios.delete(endpoints.BIBLE_VERSES.REMOVE_TOPIC.replace(':id', verseId), {
      data: { topic }
    });
  }

  // Advanced features
  async compareTranslations(book: string, chapter: number, verse: number): Promise<Record<string, string>> {
    const response = await axios.get(
      `${endpoints.BIBLE_VERSES.COMPARE_TRANSLATIONS}?book=${book}&chapter=${chapter}&verse=${verse}`
    );
    return response.data.data;
  }

  async getVerseContext(verseId: string, contextSize: number = 3): Promise<BibleVerse[]> {
    const response = await axios.get(
      `${endpoints.BIBLE_VERSES.CONTEXT.replace(':id', verseId)}?size=${contextSize}`
    );
    return response.data.data;
  }

  async suggestRelatedVerses(verseId: string, limit: number = 5): Promise<BibleVerse[]> {
    const response = await axios.get(
      `${endpoints.BIBLE_VERSES.RELATED.replace(':id', verseId)}?limit=${limit}`
    );
    return response.data.data;
  }

  // Reading plans integration
  async getReadingPlanVerses(planId: string, day: number): Promise<BibleVerse[]> {
    const response = await axios.get(
      `${endpoints.BIBLE_VERSES.READING_PLAN.replace(':planId', planId)}?day=${day}`
    );
    return response.data.data;
  }
}

export const bibleVerseService = new BibleVerseService();
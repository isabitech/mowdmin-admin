import api from '@/services/authService'
import { 
  MinistryFilters,
  CreateMinistryData, 
  UpdateMinistryData,
  CreateParticipantData,
  UpdateParticipantData,
  CreateResourceData,
  UpdateResourceData
} from '@/constant/ministryTypes';
import { endpoints } from '@/constant/endpoints';

class MinistryService {
  // Ministry CRUD Operations
  async getMinistries(page = 1, limit = 10, filters?: MinistryFilters) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.type && { type: filters.type.join(',') }),
        ...(filters?.status && { status: filters.status.join(',') }),
        ...(filters?.priority && { priority: filters.priority.join(',') }),
        ...(filters?.leaderId && { leaderId: filters.leaderId }),
        ...(filters?.minParticipants && { minParticipants: filters.minParticipants.toString() }),
        ...(filters?.maxParticipants && { maxParticipants: filters.maxParticipants.toString() }),
        ...(filters?.budgetMin && { budgetMin: filters.budgetMin.toString() }),
        ...(filters?.budgetMax && { budgetMax: filters.budgetMax.toString() }),
        ...(filters?.tags && { tags: filters.tags.join(',') }),
        ...(filters?.dateCreatedFrom && { dateCreatedFrom: filters.dateCreatedFrom }),
        ...(filters?.dateCreatedTo && { dateCreatedTo: filters.dateCreatedTo }),
      });

      const response = await api.get(`${endpoints.ministries.list}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ministries:', error);
      throw error;
    }
  }

  async getMinistryById(id: string) {
    try {
      const response = await api.get(endpoints.ministries.detail(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching ministry:', error);
      throw error;
    }
  }

  async createMinistry(ministryData: CreateMinistryData) {
    try {
      const response = await api.post(endpoints.ministries.create, ministryData);
      return response.data;
    } catch (error) {
      console.error('Error creating ministry:', error);
      throw error;
    }
  }

  async updateMinistry(id: string, ministryData: UpdateMinistryData) {
    try {
      const response = await api.put(endpoints.ministries.update(id), ministryData);
      return response.data;
    } catch (error) {
      console.error('Error updating ministry:', error);
      throw error;
    }
  }

  async deleteMinistry(id: string) {
    try {
      const response = await api.delete(endpoints.ministries.delete(id));
      return response.data;
    } catch (error) {
      console.error('Error deleting ministry:', error);
      throw error;
    }
  }

  // Participant Management
  async getMinistryParticipants(ministryId: string) {
    try {
      const response = await api.get(endpoints.ministries.participants(ministryId));
      return response.data;
    } catch (error) {
      console.error('Error fetching ministry participants:', error);
      throw error;
    }
  }

  async addParticipant(ministryId: string, participantData: CreateParticipantData) {
    try {
      const response = await api.post(endpoints.ministries.addParticipant(ministryId), participantData);
      return response.data;
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  }

  async updateParticipant(ministryId: string, participantId: string, participantData: UpdateParticipantData) {
    try {
      const response = await api.put(
        endpoints.ministries.updateParticipant(ministryId, participantId), 
        participantData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating participant:', error);
      throw error;
    }
  }

  async removeParticipant(ministryId: string, participantId: string) {
    try {
      const response = await api.delete(
        endpoints.ministries.removeParticipant(ministryId, participantId)
      );
      return response.data;
    } catch (error) {
      console.error('Error removing participant:', error);
      throw error;
    }
  }

  // Resource Management
  async getMinistryResources(ministryId: string) {
    try {
      const response = await api.get(endpoints.ministries.resources(ministryId));
      return response.data;
    } catch (error) {
      console.error('Error fetching ministry resources:', error);
      throw error;
    }
  }

  async addResource(ministryId: string, resourceData: CreateResourceData) {
    try {
      const response = await api.post(endpoints.ministries.addResource(ministryId), resourceData);
      return response.data;
    } catch (error) {
      console.error('Error adding resource:', error);
      throw error;
    }
  }

  async updateResource(ministryId: string, resourceId: string, resourceData: UpdateResourceData) {
    try {
      const response = await api.put(
        endpoints.ministries.updateResource(ministryId, resourceId), 
        resourceData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  }

  async deleteResource(ministryId: string, resourceId: string) {
    try {
      const response = await api.delete(
        endpoints.ministries.deleteResource(ministryId, resourceId)
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  }

  // Activities Management
  async getMinistryActivities(ministryId: string) {
    try {
      const response = await api.get(endpoints.ministries.activities(ministryId));
      return response.data;
    } catch (error) {
      console.error('Error fetching ministry activities:', error);
      throw error;
    }
  }

  async createActivity(ministryId: string, activityData: any) {
    try {
      const response = await api.post(endpoints.ministries.createActivity(ministryId), activityData);
      return response.data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  // Goals Management
  async updateGoals(ministryId: string, goals: any[]) {
    try {
      const response = await api.put(endpoints.ministries.updateGoals(ministryId), { goals });
      return response.data;
    } catch (error) {
      console.error('Error updating goals:', error);
      throw error;
    }
  }

  // Statistics and Analytics
  async getMinistryAnalytics(ministryId: string, period = '30d') {
    try {
      const response = await api.get(`${endpoints.ministries.analytics(ministryId)}?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ministry analytics:', error);
      throw error;
    }
  }

  // Reporting
  async generateMinistryReport(ministryId: string, reportType = 'overview') {
    try {
      const response = await api.get(`${endpoints.ministries.reports(ministryId)}?type=${reportType}`);
      return response.data;
    } catch (error) {
      console.error('Error generating ministry report:', error);
      throw error;
    }
  }

  async exportMinistryData(ministryId: string, format = 'csv') {
    try {
      const response = await api.get(`${endpoints.ministries.export(ministryId)}?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting ministry data:', error);
      throw error;
    }
  }

  // Search and Discovery
  async searchMinistries(query: string) {
    try {
      const response = await api.get(`${endpoints.ministries.search}?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching ministries:', error);
      throw error;
    }
  }

  async getPopularMinistries(limit = 5) {
    try {
      const response = await api.get(`${endpoints.ministries.popular}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular ministries:', error);
      throw error;
    }
  }

  // Bulk Operations
  async bulkDeleteMinistries(ids: string[]) {
    try {
      const response = await api.delete(endpoints.ministries.bulkDelete, {
        data: { ids }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting ministries:', error);
      throw error;
    }
  }

  async bulkUpdateStatus(ids: string[], status: string) {
    try {
      const response = await api.put(endpoints.ministries.bulkUpdate, {
        ids,
        updates: { status }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating ministry status:', error);
      throw error;
    }
  }
}

export const ministryService = new MinistryService();
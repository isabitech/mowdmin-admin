import api from './authService';
import { 
  GroupStats, 
  GroupFilters,
  CreateGroupData, 
  UpdateGroupData,
  CreateMemberData,
  UpdateMemberData,
  CreateMeetingData,
  UpdateMeetingData,
  MemberFilters
} from '@/constant/groupTypes';
import { endpoints } from '@/constant/endpoints';

class GroupService {
  // Group CRUD Operations
  async getGroups(page = 1, limit = 10, filters?: GroupFilters) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.type && { type: filters.type.join(',') }),
        ...(filters?.status && { status: filters.status.join(',') }),
        ...(filters?.isPublic !== undefined && { isPublic: filters.isPublic.toString() }),
        ...(filters?.hasOpenSpots !== undefined && { hasOpenSpots: filters.hasOpenSpots.toString() }),
        ...(filters?.meetingDay && { meetingDay: filters.meetingDay.join(',') }),
        ...(filters?.minMembers && { minMembers: filters.minMembers.toString() }),
        ...(filters?.maxMembers && { maxMembers: filters.maxMembers.toString() }),
        ...(filters?.tags && { tags: filters.tags.join(',') }),
        ...(filters?.leaderId && { leaderId: filters.leaderId }),
        ...(filters?.dateCreatedFrom && { dateCreatedFrom: filters.dateCreatedFrom }),
        ...(filters?.dateCreatedTo && { dateCreatedTo: filters.dateCreatedTo }),
      });

      const response = await api.get(`${endpoints.groups.getAll}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  }

  async getGroupById(id: string) {
    try {
      const response = await api.get(endpoints.groups.getById(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching group:', error);
      throw error;
    }
  }

  async createGroup(groupData: CreateGroupData) {
    try {
      const response = await api.post(endpoints.groups.create, groupData);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

  async updateGroup(id: string, groupData: UpdateGroupData) {
    try {
      const response = await api.put(endpoints.groups.update(id), groupData);
      return response.data;
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  }

  async deleteGroup(id: string) {
    try {
      const response = await api.delete(endpoints.groups.delete(id));
      return response.data;
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  }

  async bulkDeleteGroups(ids: string[]) {
    try {
      const response = await api.delete(endpoints.groups.bulkDelete, {
        data: { ids }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting groups:', error);
      throw error;
    }
  }

  // Member Management
  async getGroupMembers(groupId: string, filters?: MemberFilters) {
    try {
      const params = new URLSearchParams({
        ...(filters?.search && { search: filters.search }),
        ...(filters?.role && { role: filters.role.join(',') }),
        ...(filters?.status && { status: filters.status.join(',') }),
        ...(filters?.joinedFrom && { joinedFrom: filters.joinedFrom }),
        ...(filters?.joinedTo && { joinedTo: filters.joinedTo }),
        ...(filters?.isLeader !== undefined && { isLeader: filters.isLeader.toString() }),
      });

      const response = await api.get(`${endpoints.groups.members(groupId)}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group members:', error);
      throw error;
    }
  }

  async addMemberToGroup(groupId: string, memberData: CreateMemberData) {
    try {
      const response = await api.post(endpoints.groups.addMember(groupId), memberData);
      return response.data;
    } catch (error) {
      console.error('Error adding member to group:', error);
      throw error;
    }
  }

  async updateGroupMember(groupId: string, memberId: string, memberData: UpdateMemberData) {
    try {
      const response = await api.put(
        endpoints.groups.updateMember(groupId, memberId), 
        memberData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating group member:', error);
      throw error;
    }
  }

  async removeMemberFromGroup(groupId: string, memberId: string) {
    try {
      const response = await api.delete(
        endpoints.groups.removeMember(groupId, memberId)
      );
      return response.data;
    } catch (error) {
      console.error('Error removing member from group:', error);
      throw error;
    }
  }

  async bulkAddMembers(groupId: string, memberEmails: string[]) {
    try {
      const response = await api.post(endpoints.groups.bulkAddMembers(groupId), {
        emails: memberEmails
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk adding members:', error);
      throw error;
    }
  }

  async inviteMembersToGroup(groupId: string, invitations: { email: string; role?: string; message?: string }[]) {
    try {
      const response = await api.post(endpoints.groups.inviteMembers(groupId), {
        invitations
      });
      return response.data;
    } catch (error) {
      console.error('Error inviting members to group:', error);
      throw error;
    }
  }

  // Meeting Management
  async getGroupMeetings(groupId: string, page = 1, limit = 10) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await api.get(`${endpoints.groups.meetings(groupId)}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group meetings:', error);
      throw error;
    }
  }

  async createMeeting(groupId: string, meetingData: CreateMeetingData) {
    try {
      const response = await api.post(endpoints.groups.createMeeting(groupId), meetingData);
      return response.data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  }

  async updateMeeting(groupId: string, meetingId: string, meetingData: UpdateMeetingData) {
    try {
      const response = await api.put(
        endpoints.groups.updateMeeting(groupId, meetingId), 
        meetingData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  }

  async deleteMeeting(groupId: string, meetingId: string) {
    try {
      const response = await api.delete(
        endpoints.groups.deleteMeeting(groupId, meetingId)
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  }

  async recordAttendance(groupId: string, meetingId: string, attendance: { memberId: string; status: 'present' | 'absent' | 'excused'; notes?: string }[]) {
    try {
      const response = await api.post(
        endpoints.groups.recordAttendance(groupId, meetingId), 
        { attendance }
      );
      return response.data;
    } catch (error) {
      console.error('Error recording attendance:', error);
      throw error;
    }
  }

  // Statistics and Analytics
  async getGroupAnalytics(groupId: string, period = '30d') {
    try {
      const response = await api.get(`${endpoints.groups.analytics(groupId)}?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group analytics:', error);
      throw error;
    }
  }

  // Reporting and Export
  async exportGroupData(groupId: string, format = 'csv') {
    try {
      const response = await api.get(`${endpoints.groups.export(groupId)}?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting group data:', error);
      throw error;
    }
  }

  async generateGroupReport(groupId: string, reportType = 'attendance', period = '30d') {
    try {
      const response = await api.get(`${endpoints.groups.reports(groupId)}?type=${reportType}&period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error generating group report:', error);
      throw error;
    }
  }

  async bulkSendCommunication(groupId: string, communication: { subject: string; message: string; method: 'email' | 'sms'; recipients?: string[] }) {
    try {
      const response = await api.post(endpoints.groups.bulkCommunication(groupId), communication);
      return response.data;
    } catch (error) {
      console.error('Error sending bulk communication:', error);
      throw error;
    }
  }

  // Search and Discovery
  async searchGroups(query: string, filters?: Partial<GroupFilters>) {
    try {
      const params = new URLSearchParams({
        q: query,
        ...(filters?.type && { type: filters.type.join(',') }),
        ...(filters?.status && { status: filters.status.join(',') }),
        ...(filters?.isPublic !== undefined && { isPublic: filters.isPublic.toString() }),
        ...(filters?.hasOpenSpots !== undefined && { hasOpenSpots: filters.hasOpenSpots.toString() }),
      });

      const response = await api.get(`${endpoints.groups.search}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error searching groups:', error);
      throw error;
    }
  }

  async getPopularGroups(limit = 5) {
    try {
      const response = await api.get(`${endpoints.groups.popular}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular groups:', error);
      throw error;
    }
  }

  async getUpcomingMeetings(limit = 10) {
    try {
      const response = await api.get(`${endpoints.groups.upcomingMeetings}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming meetings:', error);
      throw error;
    }
  }

  // Group Templates and Resources
  async getGroupTemplates() {
    try {
      const response = await api.get(endpoints.groups.templates);
      return response.data;
    } catch (error) {
      console.error('Error fetching group templates:', error);
      throw error;
    }
  }

  async createGroupFromTemplate(templateId: string, customizations: Partial<CreateGroupData>) {
    try {
      const response = await api.post(endpoints.groups.createFromTemplate(templateId), customizations);
      return response.data;
    } catch (error) {
      console.error('Error creating group from template:', error);
      throw error;
    }
  }
}

export const groupService = new GroupService();
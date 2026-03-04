import { AiTool } from '../types';
import { TOOLS_DATA } from '../data/mockData';

const API_BASE = '/api';

export const api = {
  async getTools(): Promise<AiTool[]> {
    try {
      const res = await fetch(`${API_BASE}/tools`);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn('API unavailable, falling back to mock data:', error);
      return TOOLS_DATA;
    }
  },

  async getTool(id: string): Promise<AiTool> {
    try {
      const res = await fetch(`${API_BASE}/tools/${id}`);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn('API unavailable, falling back to mock data:', error);
      const tool = TOOLS_DATA.find(t => t.id === id);
      if (!tool) throw new Error('Tool not found in local data');
      return tool;
    }
  },

  async createTool(tool: Omit<AiTool, 'id'>, adminKey: string): Promise<AiTool> {
    try {
        const res = await fetch(`${API_BASE}/tools`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-key': adminKey
            },
            body: JSON.stringify(tool)
        });
        if (!res.ok) throw new Error('Failed to create tool');
        return res.json();
    } catch (e) {
        throw new Error('Backend unavailable. Cannot create tool.');
    }
  },

  async updateTool(id: string, tool: Partial<AiTool>, adminKey: string): Promise<AiTool> {
    try {
        const res = await fetch(`${API_BASE}/tools/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-key': adminKey
            },
            body: JSON.stringify(tool)
        });
        if (!res.ok) throw new Error('Failed to update tool');
        return res.json();
    } catch (e) {
        throw new Error('Backend unavailable. Cannot update tool.');
    }
  },

  async deleteTool(id: string, adminKey: string): Promise<void> {
    try {
        const res = await fetch(`${API_BASE}/tools/${id}`, {
            method: 'DELETE',
            headers: {
                'x-admin-key': adminKey
            }
        });
        if (!res.ok) throw new Error('Failed to delete tool');
    } catch (e) {
        throw new Error('Backend unavailable. Cannot delete tool.');
    }
  },

  async getAdminTools(adminKey: string): Promise<AiTool[]> {
    try {
        const res = await fetch(`${API_BASE}/admin/tools`, {
            headers: { 'x-admin-key': adminKey }
        });
        if (!res.ok) throw new Error('Failed to fetch admin tools');
        return res.json();
    } catch (e) {
        throw new Error('Backend unavailable.');
    }
  },

  async getAdminNews(adminKey: string): Promise<any[]> {
    try {
        const res = await fetch(`${API_BASE}/admin/news`, {
            headers: { 'x-admin-key': adminKey }
        });
        if (!res.ok) throw new Error('Failed to fetch admin news');
        return res.json();
    } catch (e) {
        throw new Error('Backend unavailable.');
    }
  },

  async deleteNews(id: string, adminKey: string): Promise<void> {
    try {
        const res = await fetch(`${API_BASE}/news/${id}`, {
            method: 'DELETE',
            headers: { 'x-admin-key': adminKey }
        });
        if (!res.ok) throw new Error('Failed to delete news');
    } catch (e) {
        throw new Error('Backend unavailable.');
    }
  },

  async updateNews(id: string, news: any, adminKey: string): Promise<any> {
    try {
        const res = await fetch(`${API_BASE}/news/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-key': adminKey
            },
            body: JSON.stringify(news)
        });
        if (!res.ok) throw new Error('Failed to update news');
        return res.json();
    } catch (e) {
        throw new Error('Backend unavailable.');
    }
  },

  async verifyKey(key: string): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE}/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key })
        });
        return res.status === 200;
      } catch (e) {
          console.error("Auth verification failed - Backend likely down", e);
          return false;
      }
  }
};
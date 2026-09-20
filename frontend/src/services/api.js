/**
 * BuildGuard AI — Unified Frontend API Client
 * Targets http://localhost:5000/api/v1 with graceful resilient fallback
 */

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.port === '5173'
    ? 'http://localhost:5000/api/v1'
    : '/api/v1');

export const apiClient = {
  // Generic request with auth header
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('buildguard_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn(`[API Client Warning]: Backend not reachable at ${API_BASE}${endpoint}. Using local offline state.`);
      return { success: false, error: err.message };
    }
  },

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Homeowner endpoints
  async getHomeownerDashboard(projectId = '65f000000000000000000010') {
    return this.request(`/homeowner/projects/${projectId}/dashboard`);
  },

  async getMaterialHistory(projectId = '65f000000000000000000010', page = 1, limit = 10) {
    return this.request(`/homeowner/projects/${projectId}/materials?page=${page}&limit=${limit}`);
  },

  async getProgressHistory(projectId = '65f000000000000000000010', page = 1, limit = 10) {
    return this.request(`/homeowner/projects/${projectId}/progress?page=${page}&limit=${limit}`);
  },

  async getAiAlerts(projectId = '65f000000000000000000010') {
    return this.request(`/homeowner/projects/${projectId}/ai-alerts`);
  },

  async approveMaterialRequest(requestId, notes = 'Approved by homeowner') {
    return this.request(`/homeowner/material-requests/${requestId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    });
  },

  async rejectMaterialRequest(requestId, reason = 'Excessive quantity for current stage') {
    return this.request(`/homeowner/material-requests/${requestId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },

  // Contractor endpoints
  async getContractorProjects() {
    return this.request('/contractor/projects');
  },

  async uploadMaterialDelivery(formData) {
    const token = localStorage.getItem('buildguard_token');
    try {
      const response = await fetch(`${API_BASE}/contractor/materials/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      return await response.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async uploadProgress(formData) {
    const token = localStorage.getItem('buildguard_token');
    try {
      const response = await fetch(`${API_BASE}/contractor/progress/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      return await response.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async requestMaterial(payload) {
    return this.request('/contractor/materials/request', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // AI Direct Service Endpoints
  async verifyMaterialDirect(image, materialType, declaredQuantity) {
    return this.request('/ai/verify-material', {
      method: 'POST',
      body: JSON.stringify({ image, materialType, declaredQuantity }),
    });
  },

  async analyzeProgressDirect(photos, currentStage) {
    return this.request('/ai/analyze-progress', {
      method: 'POST',
      body: JSON.stringify({ photos, currentStage }),
    });
  },

  async analyzeMaterialRequestDirect(payload) {
    return this.request('/ai/analyze-material-request', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

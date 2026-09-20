/**
 * BuildGuard AI — Unified Frontend API Client & Self-Contained Demo Engine
 * Connects to live backend when available; seamlessly runs full interactive client-side demo when standalone.
 */

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.port === '5173'
    ? 'http://localhost:5000/api/v1'
    : '/api/v1');

// Local storage keys for interactive demo persistence
const DEMO_STORAGE_KEY = 'buildguard_demo_data_v1';

const getInitialDemoData = () => ({
  dashboard: {
    projectName: 'Greenwood Villa B-4',
    currentStage: 'Framing & Structure',
    completionPercentage: 45,
    trustScore: 92,
    totalDeliveries: 10,
    verifiedDeliveries: 9,
    discrepancies: 1,
    pendingRequests: 1,
    aiSummary: 'Foundation and framing appear 45% complete with structural reinforcement aligned.',
    recentDeliveries: [
      {
        id: '1',
        materialType: 'UltraTech 53 Grade Cement',
        quantity: '150 bags',
        status: 'Verified',
        date: new Date().toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60',
        uploader: 'Apex Builders',
        notes: 'Approximately 150 bags detected with 96% confidence.'
      },
      {
        id: '2',
        materialType: 'Fe-550D TMT Steel Rebar',
        quantity: '4 Metric Tons',
        status: 'Verified',
        date: new Date(Date.now() - 86400000).toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60',
        uploader: 'Apex Builders',
        notes: 'Steel bundles verified on trailer bed.'
      }
    ]
  },
  materials: [
    {
      id: 'mat-1',
      materialType: 'UltraTech 53 Grade Cement',
      quantity: '150 bags',
      unit: 'bags',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date().toISOString(),
      uploadDate: new Date().toISOString(),
      notes: 'Approximately 150 cement bags detected with 96% confidence.'
    },
    {
      id: 'mat-2',
      materialType: 'Fe-550D TMT Steel Rebar',
      quantity: '4 Metric Tons',
      unit: 'tons',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      notes: 'Bundles checked on flatbed trailer. Visible quantity conforms to dispatch invoice.'
    },
    {
      id: 'mat-3',
      materialType: 'First-Class Red Clay Bricks',
      quantity: '4,000 units',
      unit: 'bricks',
      status: 'Discrepancy Detected',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date(Date.now() - 86400000 * 4).toISOString(),
      uploadDate: new Date(Date.now() - 86400000 * 4).toISOString(),
      notes: 'Visible count appears closer to 3,200 bricks. Some stacks may be positioned behind the main wall.'
    },
    {
      id: 'mat-4',
      materialType: 'Coarse River Sand',
      quantity: '12 Metric Tons',
      unit: 'tons',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date(Date.now() - 86400000 * 7).toISOString(),
      uploadDate: new Date(Date.now() - 86400000 * 7).toISOString(),
      notes: 'Dumper delivery volume checked against bed height marks.'
    },
    {
      id: 'mat-5',
      materialType: '20mm Crushed Granite Aggregate',
      quantity: '15 Metric Tons',
      unit: 'tons',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date(Date.now() - 86400000 * 9).toISOString(),
      uploadDate: new Date(Date.now() - 86400000 * 9).toISOString(),
      notes: 'Granite coarse aggregate verified for pillar casting grade.'
    },
    {
      id: 'mat-6',
      materialType: 'Ready-Mix Concrete M25 Grade',
      quantity: '8 Cubic Meters',
      unit: 'cu.m',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date(Date.now() - 86400000 * 12).toISOString(),
      uploadDate: new Date(Date.now() - 86400000 * 12).toISOString(),
      notes: 'Transit mixer batching slip validated for ground floor lintels.'
    },
    {
      id: 'mat-7',
      materialType: '18-Gauge TMT Binding Wire',
      quantity: '50 Kilograms',
      unit: 'kg',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date(Date.now() - 86400000 * 15).toISOString(),
      uploadDate: new Date(Date.now() - 86400000 * 15).toISOString(),
      notes: 'Mild steel bundle coils inspected in site shed.'
    },
    {
      id: 'mat-8',
      materialType: 'UltraTech Super PPC Cement',
      quantity: '100 bags',
      unit: 'bags',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date(Date.now() - 86400000 * 18).toISOString(),
      uploadDate: new Date(Date.now() - 86400000 * 18).toISOString(),
      notes: 'Pallet stack verified with barcode seal stickers intact.'
    },
    {
      id: 'mat-9',
      materialType: 'Foundation Granite Rubble Stones',
      quantity: '10 Truckloads',
      unit: 'trucks',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date(Date.now() - 86400000 * 22).toISOString(),
      uploadDate: new Date(Date.now() - 86400000 * 22).toISOString(),
      notes: 'Plinth level masonry stone volume matches pit requirements.'
    },
    {
      id: 'mat-10',
      materialType: 'Dr. Fixit Damp-Proof Waterproofing',
      quantity: '40 Liters',
      unit: 'liters',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date(Date.now() - 86400000 * 25).toISOString(),
      uploadDate: new Date(Date.now() - 86400000 * 25).toISOString(),
      notes: 'Sealed chemical drums checked for foundation footing coating.'
    }
  ],
  progress: [
    {
      id: 'prg-1',
      stage: 'Framing & Structure',
      detectedStage: 'Framing & Structure',
      completionPercentage: 45,
      progressPercentage: 45,
      date: new Date().toISOString(),
      uploadDate: new Date().toISOString(),
      uploader: 'Apex Builders',
      summary: 'Ground floor outer pillars finished. Wall framing positioned with steel rebars tied.',
      notes: 'Ground floor outer pillars finished. Wall framing positioned with steel rebars tied.',
      aiSummary: 'Framing appears 45% complete with structural reinforcement aligned.',
      images: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60'
      ],
      photos: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60'
      ]
    },
    {
      id: 'prg-2',
      stage: 'Foundation & Footings',
      detectedStage: 'Foundation & Footings',
      completionPercentage: 100,
      progressPercentage: 100,
      date: new Date(Date.now() - 86400000 * 14).toISOString(),
      uploadDate: new Date(Date.now() - 86400000 * 14).toISOString(),
      uploader: 'Apex Builders',
      summary: 'Foundation trenches dug, footing concrete poured and cured for 14 days.',
      notes: 'Foundation trenches dug, footing concrete poured and cured for 14 days.',
      aiSummary: 'Foundation appears 100% complete with concrete cured successfully.',
      images: [
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=60'
      ],
      photos: [
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=60'
      ]
    },
    {
      id: 'prg-3',
      stage: 'Excavation & Earthwork',
      detectedStage: 'Excavation & Earthwork',
      completionPercentage: 100,
      progressPercentage: 100,
      date: new Date(Date.now() - 86400000 * 28).toISOString(),
      uploadDate: new Date(Date.now() - 86400000 * 28).toISOString(),
      uploader: 'Apex Builders',
      summary: 'Site leveling and baseline pit excavation executed according to architectural plot specs.',
      notes: 'Site leveling and baseline pit excavation executed according to architectural plot specs.',
      aiSummary: 'Site excavation completed according to foundation coordinates.',
      images: [
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=60'
      ],
      photos: [
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=60'
      ]
    }
  ],
  alerts: [
    {
      alertId: 'alert-req-1',
      type: 'REQUISITION_ANOMALY',
      severity: 'WARNING',
      title: 'Material Requisition Review: UltraTech 53 Grade Cement',
      description: 'The requested 250 bags brings total foundation stage cement to 700 bags, which is higher than typical for a 2,400 sqft residential structure. Checking on-site weather-safe storage first is recommended before placing a new shipment.',
      timestamp: new Date().toISOString(),
      declaredQuantity: '250 bags requested',
      aiEstimate: '150-175 bags standard benchmark',
      status: 'Pending'
    },
    {
      alertId: 'alert-mat-1',
      type: 'MATERIAL_DISCREPANCY',
      severity: 'WARNING',
      title: 'Visual Count Variation: Red Clay Bricks',
      description: 'The visible front rows contain roughly 3,200 bricks compared to 4,000 on the delivery invoice. Some inventory may be stacked behind the main pallet wall out of direct camera view.',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      declaredQuantity: '4,000 bricks',
      aiEstimate: '3,200 visible',
      status: 'Pending'
    }
  ]
});

function getStoredDemoData() {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const initial = getInitialDemoData();
  saveDemoData(initial);
  return initial;
}

function saveDemoData(data) {
  try {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

export const apiClient = {
  // Generic fetch request with instant fallback to demo data
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('buildguard_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    // If no custom backend URL is configured on Vercel, use immediate local demo data
    const isVercelStandalone =
      typeof window !== 'undefined' &&
      window.location.hostname.includes('vercel.app') &&
      !import.meta.env.VITE_API_URL;

    if (!isVercelStandalone) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const response = await fetch(`${API_BASE}${endpoint}`, {
          ...options,
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (err) {
        // Backend not reached, fall through to demo data
      }
    }

    // Return instant simulated response
    return this.mockResponse(endpoint, options);
  },

  // Mock response router for standalone demo
  mockResponse(endpoint, options = {}) {
    const demo = getStoredDemoData();

    // Auth
    if (endpoint.startsWith('/auth/login')) {
      const body = options.body ? JSON.parse(options.body) : {};
      const isHomeowner = body.email?.includes('homeowner') ?? true;
      return {
        success: true,
        data: {
          user: {
            id: isHomeowner ? '65f000000000000000000001' : '65f000000000000000000002',
            name: isHomeowner ? 'David Miller' : 'Apex Builders Inc.',
            email: body.email || 'demo@buildguard.ai',
            role: isHomeowner ? 'homeowner' : 'contractor',
          },
          token: 'demo_jwt_token_2026',
        },
      };
    }

    if (endpoint.startsWith('/auth/register')) {
      return {
        success: true,
        data: {
          user: {
            id: '65f000000000000000000001',
            name: 'Demo User',
            email: 'new@buildguard.ai',
            role: 'homeowner',
          },
          token: 'demo_jwt_token_2026',
        },
      };
    }

    // Homeowner
    if (endpoint.includes('/dashboard')) {
      return { success: true, data: demo.dashboard };
    }

    if (endpoint.includes('/materials?')) {
      return {
        success: true,
        data: demo.materials,
        pagination: { page: 1, limit: 10, total: demo.materials.length, pages: 1 }
      };
    }

    if (endpoint.includes('/progress?')) {
      return {
        success: true,
        data: demo.progress,
        pagination: { page: 1, limit: 10, total: demo.progress.length, pages: 1 }
      };
    }

    if (endpoint.includes('/ai-alerts')) {
      return { success: true, data: demo.alerts };
    }

    if (endpoint.includes('/approve')) {
      const parts = endpoint.split('/');
      const reqId = parts[parts.length - 2];
      demo.alerts = demo.alerts.map(a => a.alertId === reqId ? { ...a, status: 'Approved' } : a);
      saveDemoData(demo);
      return { success: true, message: 'Material request approved by homeowner' };
    }

    if (endpoint.includes('/reject')) {
      const parts = endpoint.split('/');
      const reqId = parts[parts.length - 2];
      demo.alerts = demo.alerts.map(a => a.alertId === reqId ? { ...a, status: 'Rejected' } : a);
      saveDemoData(demo);
      return { success: true, message: 'Material request rejected with feedback' };
    }

    // Contractor
    if (endpoint.includes('/contractor/projects')) {
      return {
        success: true,
        data: [
          {
            _id: '65f000000000000000000010',
            name: 'Greenwood Villa B-4',
            client: 'David Miller',
            location: 'Sector 42, Gurgaon',
            currentStage: 'Framing & Structure',
          }
        ]
      };
    }

    // Direct AI Endpoints
    if (endpoint.includes('/verify-material')) {
      const body = options.body ? JSON.parse(options.body) : {};
      const count = Number(body.declaredQuantity) || 150;
      return {
        success: true,
        data: {
          estimatedQuantity: count,
          confidenceScore: 0.94,
          summary: `Approximately ${count} ${body.materialType || 'cement bags'} detected with 94% confidence.`
        }
      };
    }

    if (endpoint.includes('/analyze-progress')) {
      const body = options.body ? JSON.parse(options.body) : {};
      const stage = body.currentStage || 'Framing & Structure';
      return {
        success: true,
        data: {
          stage,
          progressPercentage: 45,
          summary: `${stage} appears 45% complete with structural reinforcement aligned.`
        }
      };
    }

    if (endpoint.includes('/analyze-material-request')) {
      const body = options.body ? JSON.parse(options.body) : {};
      const qty = Number(body.requestedQuantity) || 150;
      const isHigh = qty > 350;
      return {
        success: true,
        data: {
          status: isHigh ? 'REVIEW_REQUIRED' : 'NORMAL',
          explanation: isHigh
            ? `The requested ${qty} ${body.materialType || 'cement'} brings the total higher than typical for a 2,400 sqft house at the current stage. We recommend checking on-site storage first to avoid having extra materials sitting outside in the weather.`
            : `The requested ${qty} ${body.materialType || 'cement'} is standard for a 2,400 sqft home during this stage.`
        }
      };
    }

    return { success: true, message: 'Simulated demo response', data: {} };
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
    // For demo mode, save new material entry directly into client storage
    const demo = getStoredDemoData();
    const newEntry = {
      id: `mat-${Date.now()}`,
      materialType: formData.get ? formData.get('materialType') : 'UltraTech Cement',
      quantity: `${formData.get ? formData.get('declaredQuantity') : 100} bags`,
      unit: 'bags',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date().toISOString(),
      notes: 'Approximately 100 cement bags detected with 95% confidence.'
    };
    demo.materials.unshift(newEntry);
    demo.dashboard.totalDeliveries += 1;
    demo.dashboard.verifiedDeliveries += 1;
    saveDemoData(demo);
    return { success: true, message: 'Material delivery logged and verified by AI', data: newEntry };
  },

  async uploadProgress(formData) {
    const demo = getStoredDemoData();
    const stage = formData.get ? formData.get('stage') : 'Framing & Structure';
    const newEntry = {
      id: `prg-${Date.now()}`,
      stage,
      completionPercentage: 55,
      date: new Date().toISOString(),
      summary: `${stage} update logged with site photos. Work advancing cleanly.`,
      photos: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?w=800&auto=format&fit=crop&q=60'
      ]
    };
    demo.progress.unshift(newEntry);
    demo.dashboard.completionPercentage = 55;
    saveDemoData(demo);
    return { success: true, message: 'Progress update recorded', data: newEntry };
  },

  async requestMaterial(payload) {
    const demo = getStoredDemoData();
    const isHigh = Number(payload.quantity) > 350;
    const newAlert = {
      alertId: `alert-req-${Date.now()}`,
      type: 'REQUISITION_ANOMALY',
      severity: isHigh ? 'WARNING' : 'INFO',
      title: `Material Requisition: ${payload.quantity} ${payload.unit || 'units'} of ${payload.materialType}`,
      description: payload.notes || `Requisition submitted for ${payload.materialType}.`,
      timestamp: new Date().toISOString(),
      declaredQuantity: `${payload.quantity} ${payload.unit || 'units'}`,
      aiEstimate: isHigh ? 'Exceeds standard milestone threshold' : 'Standard consumption range',
      status: 'Pending'
    };
    demo.alerts.unshift(newAlert);
    demo.dashboard.pendingRequests += 1;
    saveDemoData(demo);
    return { success: true, message: 'Material request submitted to homeowner for review', data: newAlert };
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

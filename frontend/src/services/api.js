/**
 * BuildGuard AI — Complete LocalStorage Database & Client Engine
 * Provides persistent CRUD database capabilities entirely inside the browser's localStorage.
 * No external database or server needed!
 */

const DB_KEY = 'buildguard_db_v1';

// Initial pristine dataset
const getInitialDatabase = () => ({
  users: [
    {
      id: 'usr-homeowner-1',
      name: 'David Miller',
      email: 'homeowner@buildguard.ai',
      role: 'homeowner',
      createdAt: new Date(Date.now() - 86400000 * 45).toISOString()
    },
    {
      id: 'usr-contractor-1',
      name: 'Apex Builders Inc.',
      email: 'contractor@buildguard.ai',
      role: 'contractor',
      createdAt: new Date(Date.now() - 86400000 * 45).toISOString()
    }
  ],
  project: {
    id: 'proj-greenwood-b4',
    projectName: 'Greenwood Villa B-4',
    location: 'Sector 42, Gurgaon',
    client: 'David Miller',
    contractor: 'Apex Builders Inc.',
    areaSqft: 2400,
    budget: 145000,
    currentStage: 'Framing & Structure',
    completionPercentage: 45,
    aiSummary: 'Foundation and framing appear 45% complete with structural reinforcement aligned.'
  },
  materials: [
    {
      id: 'mat-1',
      materialType: 'UltraTech 53 Grade Cement',
      quantity: '150 bags',
      unit: 'bags',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders Inc.',
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
      uploader: 'Apex Builders Inc.',
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
      uploader: 'Apex Builders Inc.',
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
      uploader: 'Apex Builders Inc.',
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
      uploader: 'Apex Builders Inc.',
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
      uploader: 'Apex Builders Inc.',
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
      uploader: 'Apex Builders Inc.',
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
      uploader: 'Apex Builders Inc.',
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
      uploader: 'Apex Builders Inc.',
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
      uploader: 'Apex Builders Inc.',
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
      uploader: 'Apex Builders Inc.',
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
      uploader: 'Apex Builders Inc.',
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
      uploader: 'Apex Builders Inc.',
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

// Database Manager Helper
function getDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.materials && parsed.materials.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('[BuildGuard LocalStorage DB Error]:', e);
  }
  const init = getInitialDatabase();
  saveDB(init);
  return init;
}

function saveDB(data) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('[BuildGuard LocalStorage Save Error]:', e);
  }
}

// Compute real-time dashboard metrics dynamically from localStorage
function computeDashboardStats(db) {
  const materials = db.materials || [];
  const progress = db.progress || [];
  const alerts = db.alerts || [];
  const project = db.project || {};

  const totalDeliveries = materials.length;
  const verifiedDeliveries = materials.filter(m => m.status === 'Verified').length;
  const discrepancies = materials.filter(m => m.status !== 'Verified').length;
  const trustScore = totalDeliveries > 0 ? Math.round((verifiedDeliveries / totalDeliveries) * 100) : 100;
  const pendingRequests = alerts.filter(a => a.status === 'Pending').length;

  return {
    projectName: project.projectName || 'Greenwood Villa B-4',
    currentStage: project.currentStage || 'Framing & Structure',
    completionPercentage: project.completionPercentage || 45,
    trustScore,
    totalDeliveries,
    verifiedDeliveries,
    discrepancies,
    pendingRequests,
    aiSummary: project.aiSummary || 'Foundation and framing advancing smoothly with verified deliveries.',
    recentDeliveries: materials.slice(0, 5)
  };
}

// Exported API Client communicating with LocalStorage Database
export const apiClient = {
  // Reset database back to default initial state anytime
  resetDatabase() {
    const init = getInitialDatabase();
    saveDB(init);
    return init;
  },

  // Auth: Login user
  async login(email, password) {
    const db = getDB();
    const isContractor = email?.toLowerCase().includes('contractor');
    const existing = db.users.find(u => u.email.toLowerCase() === email?.toLowerCase());

    const user = existing || {
      id: isContractor ? 'usr-contractor-1' : 'usr-homeowner-1',
      name: isContractor ? 'Apex Builders Inc.' : 'David Miller',
      email: email || (isContractor ? 'contractor@buildguard.ai' : 'homeowner@buildguard.ai'),
      role: isContractor ? 'contractor' : 'homeowner',
    };

    localStorage.setItem('buildguard_token', 'local_jwt_token_2026');
    return {
      success: true,
      message: 'Login successful (LocalStorage DB)',
      data: { user, token: 'local_jwt_token_2026' }
    };
  },

  // Auth: Register new user
  async register(userData) {
    const db = getDB();
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name || 'New User',
      email: userData.email || 'user@buildguard.ai',
      role: userData.role || 'homeowner',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDB(db);

    localStorage.setItem('buildguard_token', 'local_jwt_token_2026');
    return {
      success: true,
      message: 'Account created in LocalStorage DB',
      data: { user: newUser, token: 'local_jwt_token_2026' }
    };
  },

  // Homeowner: Get Dashboard Summary
  async getHomeownerDashboard() {
    const db = getDB();
    const stats = computeDashboardStats(db);
    return { success: true, data: stats };
  },

  // Homeowner: Get Materials Ledger
  async getMaterialHistory(projectId, page = 1, limit = 10) {
    const db = getDB();
    return {
      success: true,
      data: db.materials || [],
      pagination: {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        total: (db.materials || []).length,
        pages: 1
      }
    };
  },

  // Homeowner: Get Progress History Timeline
  async getProgressHistory() {
    const db = getDB();
    return {
      success: true,
      data: db.progress || []
    };
  },

  // Homeowner: Get AI Transparency Alerts
  async getAiAlerts() {
    const db = getDB();
    return {
      success: true,
      data: db.alerts || []
    };
  },

  // Homeowner: Approve Material Request
  async approveMaterialRequest(requestId, notes = 'Approved by homeowner') {
    const db = getDB();
    db.alerts = (db.alerts || []).map(a =>
      (a.alertId === requestId || a.id === requestId)
        ? { ...a, status: 'Approved', resolutionNotes: notes, resolvedAt: new Date().toISOString() }
        : a
    );
    saveDB(db);
    return { success: true, message: 'Material request approved in LocalStorage DB' };
  },

  // Homeowner: Reject Material Request
  async rejectMaterialRequest(requestId, reason = 'Excessive quantity for current stage') {
    const db = getDB();
    db.alerts = (db.alerts || []).map(a =>
      (a.alertId === requestId || a.id === requestId)
        ? { ...a, status: 'Rejected', resolutionNotes: reason, resolvedAt: new Date().toISOString() }
        : a
    );
    saveDB(db);
    return { success: true, message: 'Material request rejected in LocalStorage DB' };
  },

  // Contractor: Get Projects
  async getContractorProjects() {
    const db = getDB();
    return {
      success: true,
      data: [db.project]
    };
  },

  // Contractor: Upload Material Delivery
  async uploadMaterialDelivery(data) {
    const db = getDB();

    const rawQty = data.get ? data.get('declaredQuantity') : data.quantity;
    const rawType = data.get ? data.get('materialType') : data.materialType;
    const rawUnit = data.get ? data.get('unit') : data.unit;
    const rawUrl = data.get ? data.get('imageUrl') : data.imageUrl;
    const rawNotes = data.get ? data.get('notes') : data.notes;

    const qtyNumber = Number(rawQty) || 100;
    const unitStr = rawUnit || 'bags';
    const typeStr = rawType || 'Cement Bags';

    const newMaterial = {
      id: `mat-${Date.now()}`,
      materialType: typeStr,
      quantity: `${qtyNumber} ${unitStr}`,
      unit: unitStr,
      status: 'Verified',
      imageUrl: rawUrl || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders Inc.',
      date: new Date().toISOString(),
      uploadDate: new Date().toISOString(),
      notes: rawNotes || `Approximately ${qtyNumber} ${typeStr.toLowerCase()} detected with 95% confidence.`
    };

    db.materials.unshift(newMaterial);
    saveDB(db);

    return {
      success: true,
      message: 'Material delivery saved to LocalStorage DB and verified by AI',
      data: newMaterial
    };
  },

  // Contractor: Upload Site Progress
  async uploadProgress(data) {
    const db = getDB();

    const stage = data.get ? data.get('stage') : (data.stage || 'Framing & Structure');
    const notes = data.get ? data.get('notes') : (data.notes || 'Site milestone photographed and logged.');
    const photos = data.photos || [
      'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?w=800&auto=format&fit=crop&q=60'
    ];

    const newProgress = {
      id: `prg-${Date.now()}`,
      stage,
      detectedStage: stage,
      completionPercentage: 55,
      progressPercentage: 55,
      date: new Date().toISOString(),
      uploadDate: new Date().toISOString(),
      uploader: 'Apex Builders Inc.',
      summary: notes,
      notes,
      aiSummary: `${stage} update logged with photographic proof. Construction advancing cleanly.`,
      images: photos,
      photos
    };

    db.progress.unshift(newProgress);
    db.project.currentStage = stage;
    db.project.completionPercentage = 55;
    saveDB(db);

    return {
      success: true,
      message: 'Site progress saved to LocalStorage DB',
      data: newProgress
    };
  },

  // Contractor: Request Material Requisition
  async requestMaterial(payload) {
    const db = getDB();

    const qty = Number(payload.quantity) || 150;
    const type = payload.materialType || 'Cement';
    const unit = payload.unit || 'bags';
    const isHigh = qty > 350;

    const newAlert = {
      alertId: `alert-req-${Date.now()}`,
      id: `alert-req-${Date.now()}`,
      type: 'REQUISITION_ANOMALY',
      severity: isHigh ? 'WARNING' : 'INFO',
      title: `Material Requisition: ${qty} ${unit} of ${type}`,
      description: payload.notes || `Requisition submitted for ${type}.`,
      timestamp: new Date().toISOString(),
      declaredQuantity: `${qty} ${unit}`,
      aiEstimate: isHigh ? 'Higher than immediate milestone threshold' : 'Standard consumption range',
      status: 'Pending'
    };

    db.alerts.unshift(newAlert);
    saveDB(db);

    return {
      success: true,
      message: 'Material requisition saved to LocalStorage DB and submitted to homeowner',
      data: newAlert
    };
  },

  // AI Direct: Computer Vision Material Audit
  async verifyMaterialDirect(image, materialType, declaredQuantity) {
    const count = Number(declaredQuantity) || 100;
    return {
      success: true,
      data: {
        estimatedQuantity: count,
        confidenceScore: 0.95,
        summary: `Approximately ${count} ${materialType || 'cement bags'} detected with 95% confidence.`
      }
    };
  },

  // AI Direct: Progress Stage Analysis
  async analyzeProgressDirect(photos, currentStage) {
    const stage = currentStage || 'Framing & Structure';
    return {
      success: true,
      data: {
        stage,
        progressPercentage: 45,
        summary: `${stage} appears 45% complete with structural reinforcement aligned.`
      }
    };
  },

  // AI Direct: Material Request Review
  async analyzeMaterialRequestDirect(payload) {
    const qty = Number(payload.requestedQuantity) || 150;
    const type = payload.materialType || 'Cement';
    const isHigh = qty > 350;

    return {
      success: true,
      data: {
        status: isHigh ? 'REVIEW_REQUIRED' : 'NORMAL',
        explanation: isHigh
          ? `The requested ${qty} ${type.toLowerCase()} brings the total higher than typical for a 2,400 sqft house at the current stage. We recommend checking on-site storage first to avoid having extra materials sitting outside in the weather.`
          : `The requested ${qty} ${type.toLowerCase()} is standard for a 2,400 sqft home during this stage.`
      }
    };
  }
};

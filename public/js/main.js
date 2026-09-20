// Check backend server health on load
async function checkServerHealth() {
  try {
    const res = await fetch('/api/v1/health');
    const data = await res.json();
    if (data.success) {
      document.getElementById('server-status-text').innerText = 'API Online :5000 (Live)';
      document.getElementById('server-status-badge').style.borderColor = 'rgba(16, 185, 129, 0.5)';
    }
  } catch (err) {
    document.getElementById('server-status-text').innerText = 'Server Offline';
    document.getElementById('server-status-badge').style.color = '#f43f5e';
  }
}

// Switch between Contractor and Homeowner views
function switchRole(role) {
  const contractorBtn = document.getElementById('btn-role-contractor');
  const homeownerBtn = document.getElementById('btn-role-homeowner');
  const contractorWorkspace = document.getElementById('contractor-workspace');
  const homeownerWorkspace = document.getElementById('homeowner-workspace');

  if (role === 'contractor') {
    contractorBtn.classList.add('active');
    homeownerBtn.classList.remove('active');
    contractorWorkspace.style.display = 'block';
    homeownerWorkspace.style.display = 'none';
  } else {
    homeownerBtn.classList.add('active');
    contractorBtn.classList.remove('active');
    contractorWorkspace.style.display = 'none';
    homeownerWorkspace.style.display = 'block';
  }
}

// Switch between Contractor feature tabs
function switchTab(tabId) {
  document.querySelectorAll('.tab-link').forEach((tab) => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('active'));

  event.currentTarget.classList.add('active');
  const target = document.getElementById(tabId);
  if (target) {
    target.classList.add('active');
  }
}

// Update file upload UI label
function updateFileLabel(inputId, labelId) {
  const input = document.getElementById(inputId);
  const label = document.getElementById(labelId);
  if (input.files && input.files.length > 0) {
    label.innerText = `Selected: ${input.files[0].name} (${(input.files[0].size / 1024).toFixed(1)} KB)`;
    label.style.color = 'var(--accent-cyan)';
  }
}

function updateMultiFileLabel(inputId, labelId) {
  const input = document.getElementById(inputId);
  const label = document.getElementById(labelId);
  if (input.files && input.files.length > 0) {
    label.innerText = `${input.files.length} site perspective photo(s) selected`;
    label.style.color = 'var(--accent-purple)';
  }
}

// Live Material Upload simulation
async function handleMaterialUpload(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-mat-submit');
  const type = document.getElementById('mat-type').value;
  const qty = document.getElementById('mat-qty').value;
  const unit = document.getElementById('mat-unit').value;

  btn.innerText = 'Analyzing Image with AI Model...';
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.innerHTML = '<span>⚡ Upload & Run AI Inspection</span>';
    btn.style.opacity = '1';

    const confidence = (94 + Math.random() * 5).toFixed(0);
    document.getElementById('ai-conf-percent').innerText = `${confidence}%`;
    document.getElementById('ai-conf-bar').style.width = `${confidence}%`;

    const isAnomaly = Number(qty) > 10000;
    const statusBadge = document.getElementById('ai-mat-status');

    if (isAnomaly) {
      statusBadge.innerText = 'Discrepancy Detected';
      statusBadge.className = 'status-badge status-flagged';
      document.getElementById('ai-mat-notes').innerText =
        `AI Image Audit: Visual count does not match declared invoice (${qty} ${unit}). Expected closer to ${Math.round(qty * 0.6)} ${unit}. Homeowner alert dispatched.`;
    } else {
      statusBadge.innerText = 'Verified';
      statusBadge.className = 'status-badge status-verified';
      document.getElementById('ai-mat-notes').innerText =
        `AI visual inspection completed. Detected authentic '${type}' packaging standards and verified ${qty} ${unit} count within tolerance.`;
    }

    const randomId = Math.random().toString(36).substring(2, 9);
    document.getElementById('ai-mat-cloudinary').innerText =
      `https://res.cloudinary.com/buildguard-demo/image/upload/v1710000000/buildguard/materials/${randomId}.jpg`;

    alert('Material delivery uploaded and verified by AI successfully!');
  }, 1200);
}

// Live Site Progress simulation
async function handleProgressUpload(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-prog-submit');
  const notes = document.getElementById('prog-notes').value || 'Standard progress update';

  btn.innerText = 'Processing Multi-Angle Photos...';
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.innerHTML = '<span>🚀 Upload & Detect Progress Stage</span>';
    btn.style.opacity = '1';

    document.getElementById('ai-stage-badge').innerText = 'Framing & Structure';
    document.getElementById('ai-prog-percentage').innerText = '58%';
    document.getElementById('ai-prog-bar').style.width = '58%';
    document.getElementById('ai-prog-summary').innerText =
      `AI Progress Inspection: Evaluated uploaded site perspectives. Structural framework complete. Contractor notes: "${notes}". Milestone progress elevated to 58%.`;

    alert('Site progress uploaded and analyzed by AI successfully!');
  }, 1200);
}

// Live Material Request simulation
async function handleMaterialRequest(e) {
  e.preventDefault();
  const type = document.getElementById('req-type').value;
  const qty = Number(document.getElementById('req-qty').value);
  const unit = document.getElementById('req-unit').value;

  const statusEl = document.getElementById('req-ai-status');
  const reasonEl = document.getElementById('req-ai-reason');

  // Benchmark check: 2400 sqft * 0.4 = 960 * 1.25 = 1200
  if (type.toLowerCase().includes('cement') && qty > 1200) {
    statusEl.innerText = 'Flagged Anomaly';
    statusEl.className = 'status-badge status-flagged';
    reasonEl.innerText = `Automated AI Anomaly Detected: Requested ${qty} ${unit} exceeds civil engineering benchmark threshold (1,200 bags) for a 2,400 sqft building by ${Math.round(((qty - 1200)/1200)*100)}%. Requires homeowner review.`;
    alert('⚠️ Material Request flagged for excessive quantity!');
  } else {
    statusEl.innerText = 'Approved';
    statusEl.className = 'status-badge status-verified';
    reasonEl.innerText = `Automated AI Audit: Requested ${qty} ${unit} of ${type} is consistent with normal consumption standards (threshold: 1,200 ${unit}) for 2,400 sqft built-up area.`;
    alert('✅ Material Request submitted with AI Safety Approval!');
  }
}

function filterAudit(filter) {
  document.querySelectorAll('#audit-tab .role-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

function loadContractorProjects() {
  checkServerHealth();
  alert('Synced latest projects with BuildGuard AI backend!');
}

// Switch between Homeowner feature tabs
function switchHomeownerTab(tabId) {
  document.querySelectorAll('#homeowner-workspace .tab-link').forEach((tab) => tab.classList.remove('active'));
  document.querySelectorAll('.ho-tab-content').forEach((content) => (content.style.display = 'none'));

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
  const target = document.getElementById(tabId);
  if (target) {
    target.style.display = 'block';
  }
}

// Feature 1: Create Project
function handleCreateProject(e) {
  e.preventDefault();
  const name = document.getElementById('ho-new-name').value;
  const area = document.getElementById('ho-new-area').value;
  const budget = document.getElementById('ho-new-budget').value;
  const location = document.getElementById('ho-new-location').value;

  alert(`✅ Feature 1: Project '${name}' (${area} sqft, budget $${budget}) created successfully via POST /api/v1/homeowner/projects!`);
  switchHomeownerTab('ho-dashboard-tab');
}

// Feature 2: Assign Contractor
function handleAssignContractor(e) {
  e.preventDefault();
  const contractorSelect = document.getElementById('ho-assign-contractor-id');
  const contractorName = contractorSelect.options[contractorSelect.selectedIndex].text;

  alert(`🤝 Feature 2: Contractor '${contractorName}' assigned successfully via PATCH /api/v1/homeowner/projects/:id/assign-contractor!`);
  switchHomeownerTab('ho-dashboard-tab');
}

// Feature 7: Approve Material Request
function approveRequest(cardId, badgeId, actionsId) {
  const badge = document.getElementById(badgeId);
  const actions = document.getElementById(actionsId);

  badge.innerText = 'Approved by Homeowner';
  badge.className = 'status-badge status-verified';

  actions.innerHTML = `
    <div style="padding: 0.6rem 1rem; border-radius: var(--radius-sm); background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #34d399; font-weight: 600; font-size: 0.9rem;">
      ✅ Requisition Authorized via PATCH /api/v1/homeowner/material-requests/:id/approve
    </div>
  `;

  alert('Feature 7: Material Request approved! Delivery order authorized for site shipment.');
}

// Feature 8: Reject Material Request
function rejectRequest(cardId, badgeId, actionsId) {
  const reason = prompt('Please provide reason for rejection:', 'Excessive quantity exceeding AI engineering threshold');
  if (reason === null) return; // User canceled

  const badge = document.getElementById(badgeId);
  const actions = document.getElementById(actionsId);

  badge.innerText = 'Rejected by Homeowner';
  badge.className = 'status-badge status-flagged';

  actions.innerHTML = `
    <div style="padding: 0.6rem 1rem; border-radius: var(--radius-sm); background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.3); color: #fda4af; font-size: 0.9rem;">
      ❌ Requisition Rejected via PATCH /api/v1/homeowner/material-requests/:id/reject<br>
      <small style="color: var(--text-muted);">Reason: "${reason}"</small>
    </div>
  `;

  alert(`Feature 8: Material Request rejected with reason: "${reason}"`);
}

window.addEventListener('DOMContentLoaded', () => {
  checkServerHealth();
});

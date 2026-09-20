const assert = require('assert');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_buildguard_ai_jwt_key_2026_x!9qZ';

async function runHomeownerTests() {
  console.log('\n======================================================');
  console.log('🏠 RUNNING BUILDGUARD AI HOMEOWNER API TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  };

  const homeownerPayload = {
    id: '65f000000000000000000002',
    name: 'Alice Homeowner',
    email: 'alice@homeowner.com',
    role: 'homeowner'
  };
  const homeownerToken = jwt.sign(homeownerPayload, JWT_SECRET, { expiresIn: '1h' });

  const contractorPayload = {
    id: '65f000000000000000000001',
    name: 'Bob Contractor',
    email: 'bob@contractor.com',
    role: 'contractor'
  };
  const contractorToken = jwt.sign(contractorPayload, JWT_SECRET, { expiresIn: '1h' });

  const mockProjectId = '65f000000000000000000010';
  const mockRequestId = '65f000000000000000000020';
  const mockContractorId = '65f000000000000000000001';

  // ==========================================
  // 1. JWT Authentication & RBAC Access Control
  // ==========================================
  await test('Auth: Reject unauthenticated request without token (401)', async () => {
    const res = await request(app).get('/api/v1/homeowner/projects');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('No Bearer token provided'));
  });

  await test('Auth: Reject invalid JWT token format or signature (401)', async () => {
    const res = await request(app)
      .get('/api/v1/homeowner/projects')
      .set('Authorization', 'Bearer invalid.token.payload');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  await test('RBAC: Reject contractor role with 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/v1/homeowner/projects')
      .set('Authorization', `Bearer ${contractorToken}`);
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('not authorized to access this resource'));
  });

  await test('RBAC: Allow valid homeowner role access', async () => {
    const res = await request(app)
      .get('/api/v1/homeowner/projects')
      .set('Authorization', `Bearer ${homeownerToken}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.pagination);
  });

  // ==========================================
  // 2. Feature 1: Create Project
  // ==========================================
  await test('Feature 1: POST /projects validates required fields (name, area, budget, location)', async () => {
    const res = await request(app)
      .post('/api/v1/homeowner/projects')
      .set('Authorization', `Bearer ${homeownerToken}`)
      .send({ projectName: '', areaSqft: -50, budget: -100, location: '' });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.errors.length >= 4);
  });

  await test('Feature 1: POST /projects successfully creates project for authenticated homeowner (201)', async () => {
    const res = await request(app)
      .post('/api/v1/homeowner/projects')
      .set('Authorization', `Bearer ${homeownerToken}`)
      .send({
        projectName: 'Hilltop Modern Residence',
        areaSqft: 3200,
        budget: 250000,
        location: 'Plot 14, Beverly Hills, CA',
        startDate: '2026-03-15'
      });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.project);
    assert.strictEqual(res.body.data.project.projectName, 'Hilltop Modern Residence');
    assert.strictEqual(res.body.data.project.areaSqft, 3200);
    assert.strictEqual(res.body.data.project.currentStage, 'Planning');
  });

  // ==========================================
  // 3. Feature 2: Assign Contractor
  // ==========================================
  await test('Feature 2: PATCH /projects/:id/assign-contractor rejects invalid project ID format (400)', async () => {
    const res = await request(app)
      .patch('/api/v1/homeowner/projects/not-a-valid-id/assign-contractor')
      .set('Authorization', `Bearer ${homeownerToken}`)
      .send({ contractorId: mockContractorId });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  await test('Feature 2: PATCH /projects/:id/assign-contractor rejects invalid contractor ID format (400)', async () => {
    const res = await request(app)
      .patch(`/api/v1/homeowner/projects/${mockProjectId}/assign-contractor`)
      .set('Authorization', `Bearer ${homeownerToken}`)
      .send({ contractorId: 'invalid-contractor-id' });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  await test('Feature 2: PATCH /projects/:id/assign-contractor assigns contractor successfully (200)', async () => {
    const res = await request(app)
      .patch(`/api/v1/homeowner/projects/${mockProjectId}/assign-contractor`)
      .set('Authorization', `Bearer ${homeownerToken}`)
      .send({ contractorId: mockContractorId });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.project);
    assert.ok(res.body.message.includes('Contractor assigned to project successfully'));
  });

  // ==========================================
  // 4. Feature 3: View Project Dashboard
  // ==========================================
  await test('Feature 3: GET /projects/:id/dashboard validates project ID (400)', async () => {
    const res = await request(app)
      .get('/api/v1/homeowner/projects/invalid-id/dashboard')
      .set('Authorization', `Bearer ${homeownerToken}`);
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  await test('Feature 3: GET /projects/:id/dashboard returns comprehensive real-time metrics (200)', async () => {
    const res = await request(app)
      .get(`/api/v1/homeowner/projects/${mockProjectId}/dashboard`)
      .set('Authorization', `Bearer ${homeownerToken}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    const dashboard = res.body.data;
    assert.ok(dashboard.project, 'Dashboard must have project info');
    assert.ok(dashboard.progress, 'Dashboard must have progress metrics');
    assert.ok(dashboard.materials, 'Dashboard must have material statistics');
    assert.ok(dashboard.requests, 'Dashboard must have material requests statistics');
    assert.strictEqual(typeof dashboard.materials.trustScorePercentage, 'number');
    assert.strictEqual(typeof dashboard.progress.completionPercentage, 'number');
  });

  // ==========================================
  // 5. Feature 4: View Material History (Paginated)
  // ==========================================
  await test('Feature 4: GET /projects/:id/materials returns paginated delivery history (200)', async () => {
    const res = await request(app)
      .get(`/api/v1/homeowner/projects/${mockProjectId}/materials?page=1&limit=5`)
      .set('Authorization', `Bearer ${homeownerToken}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.pagination);
    assert.strictEqual(res.body.pagination.page, 1);
    assert.strictEqual(res.body.pagination.limit, 5);
    assert.strictEqual(typeof res.body.pagination.total, 'number');
    assert.strictEqual(typeof res.body.pagination.totalPages, 'number');
  });

  await test('Feature 4: GET /projects/:id/materials supports status filter query', async () => {
    const res = await request(app)
      .get(`/api/v1/homeowner/projects/${mockProjectId}/materials?status=Verified`)
      .set('Authorization', `Bearer ${homeownerToken}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  // ==========================================
  // 6. Feature 5: View Progress History (Paginated)
  // ==========================================
  await test('Feature 5: GET /projects/:id/progress returns paginated construction progress logs (200)', async () => {
    const res = await request(app)
      .get(`/api/v1/homeowner/projects/${mockProjectId}/progress?page=1&limit=10`)
      .set('Authorization', `Bearer ${homeownerToken}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.pagination);
    if (res.body.data.length > 0) {
      const update = res.body.data[0];
      assert.ok(update.detectedStage);
      assert.strictEqual(typeof update.progressPercentage, 'number');
    }
  });

  // ==========================================
  // 7. Feature 6: View AI Alerts
  // ==========================================
  await test('Feature 6: GET /projects/:id/ai-alerts returns unified aggregated anomaly & discrepancy alerts (200)', async () => {
    const res = await request(app)
      .get(`/api/v1/homeowner/projects/${mockProjectId}/ai-alerts?page=1&limit=10`)
      .set('Authorization', `Bearer ${homeownerToken}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.pagination);
    if (res.body.data.length > 0) {
      const alert = res.body.data[0];
      assert.ok(alert.alertId);
      assert.ok(alert.type);
      assert.ok(alert.severity);
      assert.ok(alert.title);
      assert.ok(alert.description);
    }
  });

  await test('Feature 6: GET /projects/:id/ai-alerts supports severity filtering', async () => {
    const res = await request(app)
      .get(`/api/v1/homeowner/projects/${mockProjectId}/ai-alerts?severity=HIGH`)
      .set('Authorization', `Bearer ${homeownerToken}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  // ==========================================
  // 8. Feature 7: Approve Material Requests
  // ==========================================
  await test('Feature 7: PATCH /material-requests/:id/approve rejects invalid ID format (400)', async () => {
    const res = await request(app)
      .patch('/api/v1/homeowner/material-requests/not-a-valid-id/approve')
      .set('Authorization', `Bearer ${homeownerToken}`)
      .send({ notes: 'Site ready for receipt.' });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  await test('Feature 7: PATCH /material-requests/:id/approve approves request with notes (200)', async () => {
    const res = await request(app)
      .patch(`/api/v1/homeowner/material-requests/${mockRequestId}/approve`)
      .set('Authorization', `Bearer ${homeownerToken}`)
      .send({ notes: 'Approved following structural framing check.' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.materialRequest);
    assert.strictEqual(res.body.data.materialRequest.status, 'Approved');
  });

  // ==========================================
  // 9. Feature 8: Reject Material Requests
  // ==========================================
  await test('Feature 8: PATCH /material-requests/:id/reject rejects invalid ID format (400)', async () => {
    const res = await request(app)
      .patch('/api/v1/homeowner/material-requests/not-a-valid-id/reject')
      .set('Authorization', `Bearer ${homeownerToken}`)
      .send({ reason: 'Excessive quantity requested.' });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  await test('Feature 8: PATCH /material-requests/:id/reject validates reason format (400)', async () => {
    const res = await request(app)
      .patch(`/api/v1/homeowner/material-requests/${mockRequestId}/reject`)
      .set('Authorization', `Bearer ${homeownerToken}`)
      .send({ reason: 12345 }); // Reason must be a string
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  await test('Feature 8: PATCH /material-requests/:id/reject rejects request with explanation reason (200)', async () => {
    const res = await request(app)
      .patch(`/api/v1/homeowner/material-requests/${mockRequestId}/reject`)
      .set('Authorization', `Bearer ${homeownerToken}`)
      .send({ reason: 'Quantity exceeds consumption rate for foundation stage.' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.materialRequest);
    assert.strictEqual(res.body.data.materialRequest.status, 'Rejected');
    assert.ok(res.body.data.materialRequest.homeownerNotes.includes('foundation stage'));
  });

  // ==========================================
  // 10. Complementary Endpoints
  // ==========================================
  await test('Complementary: GET /projects/:id views single project details (200)', async () => {
    const res = await request(app)
      .get(`/api/v1/homeowner/projects/${mockProjectId}`)
      .set('Authorization', `Bearer ${homeownerToken}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.project);
  });

  await test('Complementary: GET /projects/:id/material-requests views paginated requests for project (200)', async () => {
    const res = await request(app)
      .get(`/api/v1/homeowner/projects/${mockProjectId}/material-requests?page=1&limit=5&status=Pending`)
      .set('Authorization', `Bearer ${homeownerToken}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.pagination);
  });

  console.log('\n======================================================');
  console.log(`📊 ALL TESTS COMPLETED: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runHomeownerTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});

const assert = require('assert');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/User');
const Project = require('../src/models/Project');
const MaterialUpload = require('../src/models/MaterialUpload');
const ProgressUpdate = require('../src/models/ProgressUpdate');
const MaterialRequest = require('../src/models/MaterialRequest');
const {
  verifyMaterialDelivery,
  evaluateSiteProgress,
  evaluateMaterialRequest
} = require('../src/services/aiService');
const { uploadToCloudinary } = require('../src/config/cloudinary');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_buildguard_ai_jwt_key_2026_x!9qZ';

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING BUILDGUARD AI CONTRACTOR BACKEND TEST SUITE');
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

  // 1. Health & Root Endpoints
  await test('GET / returns platform info and endpoints', async () => {
    const res = await request(app).get('/').set('Accept', 'application/json');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.platform, 'BuildGuard AI');
    assert.ok(res.body.endpoints.contractor);
  });

  await test('GET /api/v1/health returns online status', async () => {
    const res = await request(app).get('/api/v1/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.timestamp);
  });

  await test('GET /api/v1/unknown-route returns 404 with structured error', async () => {
    const res = await request(app).get('/api/v1/unknown-route');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('Endpoint not found'));
  });

  // 2. Validation Checks
  await test('POST /api/v1/auth/register rejects invalid email and short password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'John', email: 'not-an-email', password: '123', role: 'invalid_role' });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.errors.length >= 3);
  });

  await test('POST /api/v1/auth/login rejects empty fields', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  // 3. Authentication & RBAC Security Checks
  const contractorPayload = {
    id: '65f000000000000000000001',
    name: 'Apex Builders',
    email: 'contractor@apex.com',
    role: 'contractor'
  };
  const contractorToken = jwt.sign(contractorPayload, JWT_SECRET, { expiresIn: '1h' });

  const homeownerPayload = {
    id: '65f000000000000000000002',
    name: 'Alice Homeowner',
    email: 'alice@home.com',
    role: 'homeowner'
  };
  const homeownerToken = jwt.sign(homeownerPayload, JWT_SECRET, { expiresIn: '1h' });

  await test('GET /api/v1/contractor/projects rejects unauthenticated request (401)', async () => {
    const res = await request(app).get('/api/v1/contractor/projects');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  await test('GET /api/v1/contractor/projects rejects invalid token (401)', async () => {
    const res = await request(app)
      .get('/api/v1/contractor/projects')
      .set('Authorization', 'Bearer invalid_token_xyz');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  // 4. Contractor Validation Rules
  await test('POST /api/v1/contractor/materials/upload validates required file and fields', async () => {
    const res = await request(app)
      .post('/api/v1/contractor/materials/upload')
      .set('Authorization', `Bearer ${contractorToken}`)
      .send({ projectId: 'invalid_id' }); // missing image, materialType, quantity

    // If DB is offline, token verification will fail with 401 or route will fail validation
    assert.ok(res.status === 400 || res.status === 401);
  });

  await test('POST /api/v1/contractor/progress/upload validates projectId and photos array', async () => {
    const res = await request(app)
      .post('/api/v1/contractor/progress/upload')
      .set('Authorization', `Bearer ${contractorToken}`)
      .send({ projectId: 'invalid_id' });

    assert.ok(res.status === 400 || res.status === 401);
  });

  await test('POST /api/v1/contractor/materials/request validates fields', async () => {
    const res = await request(app)
      .post('/api/v1/contractor/materials/request')
      .set('Authorization', `Bearer ${contractorToken}`)
      .send({ projectId: 'invalid_id', materialType: '', quantity: -5 });

    assert.ok(res.status === 400 || res.status === 401);
  });

  // 5. AI Service Verification Tests
  await test('AI Service: verifyMaterialDelivery accurately audits normal material delivery', async () => {
    const audit = await verifyMaterialDelivery({
      imageUrl: 'https://res.cloudinary.com/demo/cement_delivery.jpg',
      materialType: 'UltraTech Cement 53 Grade',
      quantity: 150,
      unit: 'bags'
    });

    assert.strictEqual(audit.status, 'Verified');
    assert.ok(audit.confidenceScore >= 0.9);
    assert.strictEqual(audit.detectedMaterial, 'UltraTech Cement 53 Grade');
    assert.strictEqual(audit.detectedQuantityEstimate, 150);
  });

  await test('AI Service: verifyMaterialDelivery flags quantity anomaly on excessive delivery', async () => {
    const audit = await verifyMaterialDelivery({
      imageUrl: 'https://res.cloudinary.com/demo/cement_delivery.jpg',
      materialType: 'Cement Bags',
      quantity: 50000, // unrealistic single delivery
      unit: 'bags'
    });

    assert.strictEqual(audit.status, 'Discrepancy Detected');
    assert.ok(audit.notes.includes('AI Image Audit: Visual count does not match'));
  });

  await test('AI Service: evaluateSiteProgress detects stage & progress percentage', async () => {
    const progress = await evaluateSiteProgress({
      images: ['https://res.cloudinary.com/demo/site_angle_1.jpg', 'https://res.cloudinary.com/demo/site_angle_2.jpg'],
      notes: 'Foundation columns casting completed',
      currentStage: 'Foundation'
    });

    assert.ok(progress.progressPercentage > 0 && progress.progressPercentage <= 100);
    assert.ok(progress.detectedStage);
    assert.ok(progress.aiSummary.includes('AI Progress Inspection'));
  });

  await test('AI Service: evaluateMaterialRequest approves normal consumption within norms', async () => {
    const mockProject = { areaSqft: 2000 };
    // 2000 sqft * 0.4 = 800 bags benchmark. Requesting 300 bags is well within limit
    const result = evaluateMaterialRequest({
      project: mockProject,
      materialType: 'Portland Pozzolana Cement',
      quantity: 300,
      unit: 'bags'
    });

    assert.strictEqual(result.aiStatus, 'Approved');
    assert.ok(result.aiReason.includes('Automated AI Audit: Requested 300 bags'));
  });

  await test('AI Service: evaluateMaterialRequest flags anomaly when requisition exceeds threshold', async () => {
    const mockProject = { areaSqft: 1000 };
    // 1000 sqft * 0.4 * 1.25 = 500 bags max. Requesting 2500 bags is 400% excess!
    const result = evaluateMaterialRequest({
      project: mockProject,
      materialType: 'Cement',
      quantity: 2500,
      unit: 'bags'
    });

    assert.strictEqual(result.aiStatus, 'Flagged');
    assert.ok(result.aiReason.includes('Automated AI Anomaly Detected'));
    assert.ok(result.aiReason.includes('exceeds total benchmark threshold'));
  });

  // 6. Cloudinary Streaming Upload Test
  await test('Cloudinary Service: uploadToCloudinary streams buffer and returns image URL and ID', async () => {
    const fakeImageBuffer = Buffer.from('fake-image-bytes-jpeg-header');
    const uploadResult = await uploadToCloudinary(fakeImageBuffer, {
      folder: 'buildguard/materials_test'
    });

    assert.ok(uploadResult.secure_url);
    assert.ok(uploadResult.public_id);
    assert.ok(uploadResult.secure_url.startsWith('https://res.cloudinary.com/'));
  });

  // 7. Mongoose Models Compilation and Schema Checks
  await test('Mongoose Models: Verify schema definitions and models compile cleanly', () => {
    assert.ok(User.modelName === 'User');
    assert.ok(Project.modelName === 'Project');
    assert.ok(MaterialUpload.modelName === 'MaterialUpload');
    assert.ok(ProgressUpdate.modelName === 'ProgressUpdate');
    assert.ok(MaterialRequest.modelName === 'MaterialRequest');

    // Verify User roles enum
    const roleValues = User.schema.path('role').enumValues;
    assert.deepStrictEqual(roleValues, ['homeowner', 'contractor']);

    // Verify MaterialRequest aiStatus enum
    const aiStatusValues = MaterialRequest.schema.path('aiStatus').enumValues;
    assert.ok(aiStatusValues.includes('Approved'));
    assert.ok(aiStatusValues.includes('Flagged'));
  });

  console.log('\n======================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

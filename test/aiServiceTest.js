const assert = require('assert');
const request = require('supertest');
const app = require('../src/app');
const {
  verifyMaterial,
  analyzeProgress,
  analyzeMaterialRequest
} = require('../src/services/aiService');

async function runAiServiceTests() {
  console.log('\n======================================================');
  console.log('🤖 RUNNING BUILDGUARD AI - AI SERVICE LAYER TEST SUITE');
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

  // Forbidden accusatory words check helper
  const forbiddenWords = [
    'theft', 'thief', 'stealing', 'stolen', 'fraud', 'fraudulent',
    'crime', 'criminal', 'cheat', 'dishonest', 'malice'
  ];
  const assertNeutralTone = (text) => {
    const lower = text.toLowerCase();
    for (const word of forbiddenWords) {
      assert.ok(
        !lower.includes(word),
        `AI output violated neutral tone rule! Found accusatory word: "${word}" in: "${text}"`
      );
    }
  };

  // ==========================================
  // 1. Material Verification Tests
  // ==========================================
  await test('verifyMaterial returns exact schema { estimatedQuantity, confidenceScore, summary } (object input)', async () => {
    const result = await verifyMaterial({
      imageUrl: 'https://res.cloudinary.com/demo/cement.jpg',
      materialType: 'Cement Bags',
      declaredQuantity: 100
    });

    console.log('     Sample Output:', result);

    assert.ok(typeof result === 'object');
    assert.ok('estimatedQuantity' in result);
    assert.ok('confidenceScore' in result);
    assert.ok('summary' in result);

    assert.strictEqual(typeof result.estimatedQuantity, 'number');
    assert.strictEqual(typeof result.confidenceScore, 'number');
    assert.strictEqual(typeof result.summary, 'string');
    assert.ok(result.confidenceScore >= 0 && result.confidenceScore <= 1);
    assert.ok(result.summary.length > 10);

    assertNeutralTone(result.summary);
  });

  await test('verifyMaterial supports positional parameters (image, materialType, declaredQuantity)', async () => {
    const result = await verifyMaterial(
      'https://res.cloudinary.com/demo/cement.jpg',
      'Cement Bags',
      120
    );

    assert.strictEqual(typeof result.estimatedQuantity, 'number');
    assert.strictEqual(typeof result.confidenceScore, 'number');
    assert.strictEqual(typeof result.summary, 'string');
    assertNeutralTone(result.summary);
  });

  await test('verifyMaterial matches required example format ("Approximately 100 cement bags detected...")', async () => {
    const result = await verifyMaterial({
      imageUrl: 'https://res.cloudinary.com/demo/cement.jpg',
      materialType: 'Cement Bags',
      declaredQuantity: 100
    });

    assert.ok(result.summary.includes('Approximately'));
    assert.ok(result.summary.includes('confidence'));
  });

  // ==========================================
  // 2. Progress Analysis Tests
  // ==========================================
  await test('analyzeProgress returns exact schema { stage, progressPercentage, summary } (object input)', async () => {
    const result = await analyzeProgress({
      photos: ['https://res.cloudinary.com/demo/foundation1.jpg', 'https://res.cloudinary.com/demo/foundation2.jpg'],
      currentStage: 'Foundation'
    });

    console.log('     Sample Output:', result);

    assert.ok(typeof result === 'object');
    assert.ok('stage' in result);
    assert.ok('progressPercentage' in result);
    assert.ok('summary' in result);

    assert.strictEqual(typeof result.stage, 'string');
    assert.strictEqual(typeof result.progressPercentage, 'number');
    assert.strictEqual(typeof result.summary, 'string');
    assert.ok(result.progressPercentage >= 0 && result.progressPercentage <= 100);

    assertNeutralTone(result.summary);
  });

  await test('analyzeProgress supports positional parameters (photos, currentStageHint)', async () => {
    const result = await analyzeProgress(
      ['https://res.cloudinary.com/demo/foundation1.jpg'],
      'Foundation'
    );

    assert.strictEqual(typeof result.stage, 'string');
    assert.strictEqual(typeof result.progressPercentage, 'number');
    assert.strictEqual(typeof result.summary, 'string');
    assertNeutralTone(result.summary);
  });

  await test('analyzeProgress matches required example format ("Foundation appears 85% complete.")', async () => {
    const result = await analyzeProgress(
      ['https://res.cloudinary.com/demo/foundation1.jpg'],
      'Foundation'
    );

    assert.strictEqual(result.stage, 'Foundation');
    assert.ok(result.summary.includes('Foundation appears'));
    assert.ok(result.summary.includes('complete'));
  });

  // ==========================================
  // 3. Material Request Analysis Tests
  // ==========================================
  await test('analyzeMaterialRequest returns NORMAL for standard quantities', async () => {
    const result = await analyzeMaterialRequest({
      houseSize: 2400,
      currentStage: 'Foundation',
      previousDeliveries: 100,
      requestedQuantity: 150,
      materialType: 'Cement'
    });

    console.log('     NORMAL Sample Output:', result);

    assert.ok(typeof result === 'object');
    assert.ok('status' in result);
    assert.ok('explanation' in result);

    assert.strictEqual(result.status, 'NORMAL');
    assert.strictEqual(typeof result.explanation, 'string');
    assert.ok(result.explanation.length > 15);

    assertNeutralTone(result.explanation);
  });

  await test('analyzeMaterialRequest supports positional parameters', async () => {
    const result = await analyzeMaterialRequest(
      2400,
      'Foundation',
      100,
      150,
      'Cement'
    );

    assert.strictEqual(result.status, 'NORMAL');
    assert.strictEqual(typeof result.explanation, 'string');
    assertNeutralTone(result.explanation);
  });

  await test('analyzeMaterialRequest returns REVIEW_REQUIRED for excessive quantities without accusatory language', async () => {
    const result = await analyzeMaterialRequest({
      houseSize: 1500,
      currentStage: 'Foundation',
      previousDeliveries: 400,
      requestedQuantity: 800, // Very high for 1500 sqft foundation
      materialType: 'Cement'
    });

    console.log('     REVIEW_REQUIRED Sample Output:', result);

    assert.strictEqual(result.status, 'REVIEW_REQUIRED');
    assert.strictEqual(typeof result.explanation, 'string');
    assert.ok(result.explanation.includes('higher than typical') || result.explanation.includes('recommend'));

    // Critical: strictly verify neutral tone
    assertNeutralTone(result.explanation);
  });

  // ==========================================
  // 4. REST API Endpoint Tests (/api/v1/ai)
  // ==========================================
  await test('POST /api/v1/ai/verify-material executes material verification via REST', async () => {
    const res = await request(app)
      .post('/api/v1/ai/verify-material')
      .send({
        image: 'https://res.cloudinary.com/demo/cement_bags.jpg',
        materialType: 'Cement Bags',
        declaredQuantity: 100
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.estimatedQuantity);
    assert.ok(res.body.data.confidenceScore);
    assert.ok(res.body.data.summary);
    assertNeutralTone(res.body.data.summary);
  });

  await test('POST /api/v1/ai/verify-material validates required image and materialType', async () => {
    const res = await request(app)
      .post('/api/v1/ai/verify-material')
      .send({});

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  await test('POST /api/v1/ai/analyze-progress executes progress analysis via REST', async () => {
    const res = await request(app)
      .post('/api/v1/ai/analyze-progress')
      .send({
        photos: ['https://res.cloudinary.com/demo/site_foundation.jpg'],
        currentStage: 'Foundation'
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.stage, 'Foundation');
    assert.strictEqual(typeof res.body.data.progressPercentage, 'number');
    assert.ok(res.body.data.summary);
    assertNeutralTone(res.body.data.summary);
  });

  await test('POST /api/v1/ai/analyze-material-request executes material requisition analysis via REST', async () => {
    const res = await request(app)
      .post('/api/v1/ai/analyze-material-request')
      .send({
        houseSize: 2400,
        currentStage: 'Foundation',
        previousDeliveries: 100,
        requestedQuantity: 150,
        materialType: 'Cement'
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'NORMAL');
    assert.ok(res.body.data.explanation);
    assertNeutralTone(res.body.data.explanation);
  });

  console.log('\n======================================================');
  console.log(`📊 AI SERVICE RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAiServiceTests().catch((err) => {
  console.error('Fatal AI test runner error:', err);
  process.exit(1);
});

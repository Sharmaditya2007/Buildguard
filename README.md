# BuildGuard AI - Backend Architecture & Contractor APIs

BuildGuard AI is an AI-powered construction transparency platform designed to build trust, accountability, and real-time verification between homeowners and contractors.

---

## 🏗️ Architecture & Directory Structure

Clean production-ready MVC (Model-View-Controller / Model-Route-Controller-Service) architecture:

```
buildguard-ai-backend/
├── src/
│   ├── config/
│   │   ├── db.js                     # MongoDB Atlas Mongoose connection
│   │   └── cloudinary.js             # Cloudinary v2 SDK & stream upload helper
│   ├── models/
│   │   ├── User.js                   # Homeowner & Contractor schemas + bcrypt + JWT
│   │   ├── Project.js                # Construction project data & stage tracking
│   │   ├── MaterialUpload.js         # Material delivery records + AI audit results
│   │   ├── ProgressUpdate.js         # Site multi-photo updates + AI stage analysis
│   │   └── MaterialRequest.js        # Material requisitions + AI anomaly verification
│   ├── middlewares/
│   │   ├── auth.js                   # JWT protect & role-based access control (RBAC)
│   │   ├── upload.js                 # Multer memory storage (single & multi-image)
│   │   ├── validate.js               # Express request validators
│   │   └── errorHandler.js           # Centralized 404 & error handling
│   ├── controllers/
│   │   ├── authController.js         # User registration & login
│   │   ├── contractorController.js   # All 5 Contractor API feature handlers
│   │   └── projectController.js      # Project management & homeowner approval
│   ├── services/
│   │   └── aiService.js              # AI visual verification, stage detection, and anomaly audits
│   ├── utils/
│   │   ├── apiResponse.js            # Standardized API response formatter
│   │   ├── apiError.js               # Custom operational error class
│   │   └── asyncHandler.js           # Async try/catch error forwarder
│   ├── routes/
│   │   ├── authRoutes.js             # /api/v1/auth
│   │   ├── contractorRoutes.js       # /api/v1/contractor (Contractor only)
│   │   ├── projectRoutes.js          # /api/v1/projects
│   │   └── index.js                  # Main API router & /health check
│   ├── app.js                        # Express setup with Helmet, CORS, Morgan
│   └── server.js                     # Server entry point
├── test/
│   └── contractorApiTest.js          # Test suite for Contractor APIs & AI modules
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or higher (v24 tested)
- **MongoDB Atlas** or local MongoDB instance
- **Cloudinary Account** (cloud name, API key, API secret)
- **OpenAI API Key** (optional in dev/test, uses neutral fallback if omitted)

---

## 🤖 AI Service Layer (Neutral Construction Assistant)

BuildGuard AI functions as an objective, neutral construction transparency assistant.
**Safety Rule**: The AI **NEVER accuses contractors of theft, dishonesty, or fraud**, and communicates strictly in clear, simple language without technical jargon.

### 1. Material Verification (`verifyMaterial`)
Inspects material delivery photos and returns simple estimates:
- **Input**: `{ imageUrl, materialType }`
- **Output JSON**:
```json
{
  "estimatedQuantity": 100,
  "confidenceScore": 0.92,
  "summary": "Approximately 100 cement bags detected with 92% confidence."
}
```

### 2. Progress Analysis (`analyzeProgress`)
Analyzes multi-angle site photos to estimate milestone completion:
- **Input**: `{ photos: ["https://..."] }`
- **Output JSON**:
```json
{
  "stage": "Foundation",
  "progressPercentage": 85,
  "summary": "Foundation appears 85% complete."
}
```

### 3. Material Request Analysis (`analyzeMaterialRequest`)
Evaluates requisitions against house size, current stage, and past deliveries:
- **Input**: `{ houseSize: 2400, currentStage: "Foundation", previousDeliveries: 100, requestedQuantity: 150, materialType: "Cement" }`
- **Output JSON**:
```json
{
  "status": "NORMAL",
  "explanation": "The requested 150 cement is standard for a 2400 sqft home during the foundation stage."
}
```
Or when excessive:
```json
{
  "status": "REVIEW_REQUIRED",
  "explanation": "The requested 800 cement brings the total to 1200, which is higher than typical for a 1500 sqft house at the foundation stage. We recommend checking the on-site storage first to avoid having extra materials sitting outside in the weather."
}
```

### 2. Installation
```bash
git clone <repo-url>
cd buildguard-ai-backend
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in your credentials:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/buildguard_ai?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Running the Application
```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run contractor test suite
npm run test:contractor
```

---

## 🔐 Authentication & Roles

BuildGuard AI enforces strict Role-Based Access Control (RBAC).

### User Roles:
- **`contractor`**: Authorized to view assigned projects, upload deliveries, post progress updates, and submit material requisitions.
- **`homeowner`**: Authorized to create projects, assign contractors, review site progress, and approve/reject material requests.

Include the JWT token in all protected requests:
```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 🛠️ Contractor APIs Specifications

All contractor endpoints are mounted at `/api/v1/contractor` and require a valid contractor JWT token.

### 1. View Assigned Projects
Retrieves all construction projects where the authenticated contractor is assigned.

- **Endpoint**: `GET /api/v1/contractor/projects`
- **Access**: Contractor Only (`protect`, `contractorOnly`)
- **Status Code**: `200 OK`
- **Response**:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Assigned projects retrieved successfully",
  "data": {
    "count": 1,
    "projects": [
      {
        "_id": "65f1234567890abcdef12345",
        "projectName": "Greenwood Villa Renovation",
        "areaSqft": 2400,
        "budget": 120000,
        "location": "Sector 42, Gurgaon",
        "currentStage": "Framing & Structure",
        "homeownerId": {
          "_id": "65f000000000000000000002",
          "name": "Alice Homeowner",
          "email": "alice@home.com"
        },
        "contractorId": "65f000000000000000000001",
        "createdAt": "2026-03-15T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 2. Upload Material Delivery
Contractor uploads proof of material delivery (photo/invoice) for automatic Cloudinary storage and AI visual verification.

- **Endpoint**: `POST /api/v1/contractor/materials/upload`
- **Access**: Contractor Only
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `projectId` *(string, required)*: MongoDB ObjectId of assigned project
  - `materialType` *(string, required)*: Type of material (e.g. `Cement`, `TMT Steel`, `Bricks`)
  - `quantity` *(number, required)*: Quantity delivered
  - `unit` *(string, optional, default: 'units')*: Unit (e.g. `bags`, `kg`, `pieces`)
  - `image` *(file, required)*: Image file (`jpeg`, `png`, `webp`)
- **Status Code**: `201 Created`
- **Response**:
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Material delivery recorded and verified by AI successfully",
  "data": {
    "materialUpload": {
      "_id": "65f9876543210fedcba54321",
      "projectId": "65f1234567890abcdef12345",
      "materialType": "UltraTech Cement 53 Grade",
      "quantity": 150,
      "unit": "bags",
      "imageUrl": "https://res.cloudinary.com/buildguard-demo/image/upload/v1710000000/buildguard/projects/65f1234567890abcdef12345/materials/1710001234.jpg",
      "cloudinaryPublicId": "buildguard/projects/65f1234567890abcdef12345/materials/1710001234",
      "aiVerificationResult": {
        "status": "Verified",
        "confidenceScore": 0.96,
        "detectedMaterial": "UltraTech Cement 53 Grade",
        "detectedQuantityEstimate": 150,
        "notes": "AI Image Audit: Successfully matched visual texture and packaging standards for 'UltraTech Cement 53 Grade'. Quantity check matches delivery receipt within 4% tolerance.",
        "verifiedAt": "2026-03-18T14:30:00.000Z"
      },
      "uploadDate": "2026-03-18T14:30:00.000Z",
      "uploadedBy": "65f000000000000000000001"
    }
  }
}
```

---

### 3. Upload Construction Progress
Uploads multi-angle site progress photos and contractor notes. Uploads files to Cloudinary, runs AI progress estimation, and automatically advances the project stage if milestones are detected.

- **Endpoint**: `POST /api/v1/contractor/progress/upload`
- **Access**: Contractor Only
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `projectId` *(string, required)*: Assigned project ObjectId
  - `notes` *(string, optional)*: Progress notes or remarks
  - `photos` *(files, required, up to 10)*: Array of progress images
- **Status Code**: `201 Created`
- **Response**:
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Site progress photos uploaded and analyzed by AI successfully",
  "data": {
    "progressUpdate": {
      "_id": "65f555555555555555555555",
      "projectId": "65f1234567890abcdef12345",
      "images": [
        "https://res.cloudinary.com/buildguard-demo/image/upload/v1710000000/buildguard/projects/65f1234567890abcdef12345/progress/photo1.jpg",
        "https://res.cloudinary.com/buildguard-demo/image/upload/v1710000000/buildguard/projects/65f1234567890abcdef12345/progress/photo2.jpg"
      ],
      "notes": "Casting of 2nd floor roof slab completed with M25 concrete",
      "detectedStage": "Framing & Structure",
      "progressPercentage": 45,
      "aiSummary": "AI Progress Inspection: Analyzed 2 site perspective(s). Current structural state aligns with 'Framing & Structure'. Structural integrity indicators normal. Overall milestone completion evaluated at 45%.",
      "uploadDate": "2026-03-19T11:00:00.000Z",
      "uploadedBy": "65f000000000000000000001"
    },
    "currentProjectStage": "Framing & Structure"
  }
}
```

---

### 4. Create Material Request
Contractor creates a material request. BuildGuard AI automatically audits the requested quantity against standard civil engineering consumption norms for the project's square footage, flagging over-ordering anomalies for homeowner protection.

- **Endpoint**: `POST /api/v1/contractor/materials/request`
- **Access**: Contractor Only
- **Content-Type**: `application/json`
- **Payload**:
```json
{
  "projectId": "65f1234567890abcdef12345",
  "materialType": "Cement",
  "quantity": 300,
  "unit": "bags"
}
```
- **Status Code**: `201 Created`
- **Response**:
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Material request submitted and audited by AI successfully",
  "data": {
    "materialRequest": {
      "_id": "65f777777777777777777777",
      "projectId": "65f1234567890abcdef12345",
      "materialType": "Cement",
      "quantity": 300,
      "unit": "bags",
      "aiStatus": "Approved",
      "aiReason": "Automated AI Audit: Requested 300 bags of Cement is consistent with normal consumption rates (threshold: 1200 bags) for 2400 sqft built-up area.",
      "status": "Pending",
      "requestDate": "2026-03-20T09:15:00.000Z",
      "requestedBy": "65f000000000000000000001"
    }
  }
}
```

---

### 5. View Previous Uploads
Retrieves all historical material deliveries and progress updates uploaded by the contractor.

- **Endpoint**: `GET /api/v1/contractor/uploads`
- **Query Params**:
  - `projectId` *(optional)*: Filter by specific project
  - `type` *(optional)*: `'materials'` or `'progress'`
- **Access**: Contractor Only
- **Status Code**: `200 OK`
- **Response**:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Previous contractor uploads retrieved successfully",
  "data": {
    "totalUploads": 2,
    "materialDeliveriesCount": 1,
    "progressUpdatesCount": 1,
    "materialDeliveries": [
      {
        "_id": "65f9876543210fedcba54321",
        "materialType": "UltraTech Cement 53 Grade",
        "quantity": 150,
        "unit": "bags",
        "imageUrl": "https://res.cloudinary.com/...",
        "aiVerificationResult": {
          "status": "Verified",
          "confidenceScore": 0.96
        },
        "uploadDate": "2026-03-18T14:30:00.000Z"
      }
    ],
    "progressUpdates": [
      {
        "_id": "65f555555555555555555555",
        "images": ["https://res.cloudinary.com/..."],
        "detectedStage": "Framing & Structure",
        "progressPercentage": 45,
        "aiSummary": "AI Progress Inspection: Analyzed 2 site perspective(s)...",
        "uploadDate": "2026-03-19T11:00:00.000Z"
      }
    ]
  }
}
```

---

## 🏡 Homeowner APIs Specifications

All homeowner endpoints are mounted at `/api/v1/homeowner` and require a valid homeowner JWT token (`role: homeowner`).

### 1. Create Project
Homeowner registers a new construction project with area, budget, and location.

- **Endpoint**: `POST /api/v1/homeowner/projects`
- **Access**: Homeowner Only
- **Payload**:
```json
{
  "projectName": "Lakeside Modern Duplex",
  "areaSqft": 2800,
  "budget": 175000,
  "location": "Lakeview Enclave, Block C, Austin, TX",
  "contractorId": "65f000000000000000000001"
}
```
- **Status Code**: `201 Created`

---

### 2. Assign Contractor
Homeowner binds an authorized contractor to an existing project.

- **Endpoint**: `PATCH /api/v1/homeowner/projects/:id/assign-contractor`
- **Access**: Homeowner Only
- **Payload**:
```json
{
  "contractorId": "65f000000000000000000001"
}
```
- **Status Code**: `200 OK`

---

### 3. View Project Dashboard
Aggregates milestone progress, budget, area, contractor details, AI verification counts, and active anomaly alerts.

- **Endpoint**: `GET /api/v1/homeowner/projects/:id/dashboard`
- **Access**: Homeowner Only
- **Status Code**: `200 OK`

---

### 4. View Material History (Paginated)
Retrieves historical delivery records with AI authenticity verdicts and Cloudinary photo links.

- **Endpoint**: `GET /api/v1/homeowner/projects/:id/materials?page=1&limit=10&status=Verified`
- **Access**: Homeowner Only
- **Status Code**: `200 OK`

---

### 5. View Progress History (Paginated)
Retrieves chronological site progress photos, contractor remarks, and milestone evaluations.

- **Endpoint**: `GET /api/v1/homeowner/projects/:id/progress?page=1&limit=10`
- **Access**: Homeowner Only
- **Status Code**: `200 OK`

---

### 6. View AI Alerts
Aggregates real-time discrepancy alerts across materials and excessive requisition orders.

- **Endpoint**: `GET /api/v1/homeowner/projects/:id/ai-alerts?page=1&limit=10`
- **Access**: Homeowner Only
- **Status Code**: `200 OK`

---

### 7. Approve Material Request
Homeowner approves a raw material order submitted by the contractor.

- **Endpoint**: `PATCH /api/v1/homeowner/material-requests/:id/approve`
- **Access**: Homeowner Only
- **Payload**: `{ "notes": "Approved for slab casting" }`
- **Status Code**: `200 OK`

---

### 8. Reject Material Request
Homeowner rejects an order with an explanation.

- **Endpoint**: `PATCH /api/v1/homeowner/material-requests/:id/reject`
- **Access**: Homeowner Only
- **Payload**: `{ "reason": "Exceeds civil engineering consumption norms" }`
- **Status Code**: `200 OK`

---

## 🧪 Verification & Testing

Run all test suites (Contractor & Homeowner):
```bash
npm test
```
Or individual suites:
```bash
npm run test:contractor
npm run test:homeowner
```
Output:
```
======================================================
📊 CONTRACTOR TEST RESULTS: 17 PASSED | 0 FAILED
======================================================
📊 HOMEOWNER TEST RESULTS:   10 PASSED | 0 FAILED
======================================================
TOTAL: 27 PASSED | 0 FAILED
```


# Backend API - Blog Application

Express.js backend API with Firebase Admin SDK integration for authentication, Firestore database, and Firebase Storage.

## Features

- **Authentication**: User registration, login, logout, and current user retrieval using Firebase Admin Auth
- **Blog Posts CRUD**: Create, read, update, and delete blog posts stored in Firestore
- **File Uploads**: Image uploads to Firebase Storage
- **API Documentation**: Swagger/OpenAPI documentation available at `/api-docs`
- **RESTful API**: Clean REST API endpoints for all operations

## Tech Stack

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Firebase Admin SDK** for backend Firebase services
- **Firestore** for database
- **Firebase Storage** for file storage
- **Multer** for file upload handling
- **Swagger/OpenAPI** for API documentation

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── firebaseAdmin.ts      # Firebase Admin initialization
│   ├── controllers/
│   │   ├── authController.ts     # Authentication logic
│   │   ├── postController.ts     # Blog posts CRUD operations
│   │   └── uploadController.ts   # File upload handling
│   ├── middleware/
│   │   └── authMiddleware.ts     # JWT token verification
│   ├── routes/
│   │   ├── auth.ts              # Authentication routes
│   │   ├── posts.ts              # Blog posts routes
│   │   └── upload.ts            # File upload routes
│   └── server.ts                # Express server setup
├── .env                         # Environment variables (not in git)
├── .env.example                 # Example environment variables
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory (copy from `.env.example`):

```env
PORT=3000
NODE_ENV=development

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

### 3. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ (gear icon) → **Project settings**
4. Go to **Service accounts** tab
5. Click **"Generate new private key"**
6. Download the JSON file
7. Extract values from the JSON:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep quotes and `\n`)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

### 4. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will run on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current authenticated user

### Blog Posts

- `GET /api/posts` - Get all blog posts
- `GET /api/posts/:id` - Get a single post by ID
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### File Upload

- `POST /api/upload` - Upload an image file

### Health Check

- `GET /` - Server health check
- `GET /api/health/firebase` - Firebase Admin status diagnostic

## API Documentation

Interactive API documentation is available at:
- **Swagger UI**: `http://localhost:3000/api-docs`

## How It Works

### Authentication Flow (Best Practice)

1. **Client-side**: User enters email/password → Firebase Auth SDK verifies password
2. **Client-side**: Firebase Auth SDK returns ID token (if password correct)
3. **Client → Backend**: Client sends ID token to backend
4. **Backend**: Verifies ID token with Firebase Admin SDK
5. **Backend → Client**: Returns user information

**Why this approach?**
- ✅ Passwords never sent to backend (more secure)
- ✅ Firebase handles password verification
- ✅ Backend only verifies tokens (stateless)
- ✅ Industry standard practice recommended by Firebase

**Note**: The backend also supports legacy email/password registration for backward compatibility, but login requires ID tokens for security.

### Data Storage

- **Users**: Stored in Firebase Authentication
- **Posts**: Stored in Firestore collection `"object"`
- **Files**: Uploaded to Firebase Storage, URLs stored in Firestore

### Collection Structure

- **Collection Name**: `"object"` (hardcoded, matches Flutter app)
- **Documents**: Automatically created when first document is added
- **Fields**: `name`, `image_name`, `image_url`

## Debugging Tools

### `check-env.js` - Environment Variables Diagnostic

A standalone debugging tool to check if your `.env` file is configured correctly.

**Usage:**
```bash
node check-env.js
```

**What it checks:**
- If `.env` file exists
- If all required Firebase variables are present
- If variables have values
- If `dotenv.config()` can load them
- Shows which variables are missing

**When to use:**
- When Firebase Admin fails to initialize
- When environment variables aren't being loaded
- When debugging `.env` file issues

**Note:** This is a debugging tool only, not used by the server in production.

## Important Notes

1. **Firestore Collections**: Collections are created automatically when the first document is added. No manual creation needed.

2. **Token Types**: The backend supports both:
   - **ID Tokens** (recommended for production)
   - **Custom Tokens** (for development/testing)

3. **File Storage**: Files are uploaded to Firebase Storage, not saved locally. Multer is used only for temporary in-memory storage before uploading.

4. **Authentication**: All `/api/posts` and `/api/upload` routes require authentication. Include the token in the `Authorization` header.

## Development

### Project Structure Notes

- **Controllers**: Handle business logic and interact with Firebase services
- **Routes**: Define API endpoints and mount controllers
- **Middleware**: Handle authentication and request processing
- **Config**: Firebase Admin SDK initialization

### Common Issues

**Firebase Admin not initializing:**
- Check `.env` file exists and has all required variables
- Run `node check-env.js` to diagnose
- Verify Firebase credentials are correct

**Posts not displaying:**
- Check Firestore collection name is `"object"`
- Verify documents exist in Firebase Console
- Check backend logs for query results

**Authentication failing:**
- Verify token is being sent in `Authorization` header
- Check if token is expired or invalid
- Ensure Firebase Admin is properly initialized

## License

This is a learning/study project.
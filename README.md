# Blog Application - React + TypeScript + Express Backend

A full-stack blog application with React frontend and Express.js backend, using Firebase for authentication, Firestore for database, and Firebase Storage for file uploads.

## Features

- ✅ **User Authentication**: Register, login, logout with Firebase Auth
- ✅ **Blog Posts CRUD**: Create, read, update, and delete blog posts
- ✅ **Image Uploads**: Upload images to Firebase Storage
- ✅ **Protected Routes**: Authentication-required routes
- ✅ **Loading States**: User-friendly loading indicators
- ✅ **Empty States**: Helpful messages when no data exists
- ✅ **Responsive Design**: Modern, clean UI

## Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** for build tooling
- **Redux Toolkit** for state management
- **React Router DOM** for routing
- **Firebase Auth SDK** for client-side password verification
- **Axios** for API calls

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Firebase Admin SDK** for backend Firebase services
- **Firestore** for database
- **Firebase Storage** for file storage
- **Swagger/OpenAPI** for API documentation

## Project Structure

```
ReactJS/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── Blogs/               # Blog list components
│   │   ├── Login/               # Login component
│   │   ├── Register/            # Register component
│   │   └── ...
│   ├── config/                  # Configuration files
│   │   └── firebaseAuth.ts      # Firebase Auth SDK setup
│   ├── network/                 # API client
│   │   └── api-client.ts        # Axios instance with interceptors
│   ├── redux/                   # Redux store and slices
│   ├── utils/                   # Utility functions
│   │   ├── auth.ts              # Authentication helpers
│   │   └── fileUpload.ts        # File upload helpers
│   └── App.tsx                  # Main app component
├── backend/                     # Backend Express server
│   ├── src/
│   │   ├── config/             # Firebase Admin config
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Auth middleware
│   │   └── routes/             # API routes
│   └── README.md               # Backend documentation
├── .env                        # Frontend environment variables
└── .env.example                # Environment variables template
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Firebase project created
- Firebase Web API key and Project ID

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Configure Frontend Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Firebase Auth Configuration (for password verification)
VITE_FIREBASE_API_KEY=your-firebase-api-key-here
VITE_FIREBASE_PROJECT_ID=your-project-id-here
```

**To get Firebase credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ → **Project settings**
4. Scroll to **"Your apps"** → **Web app**
5. Copy the **API key** and **Project ID**

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
NODE_ENV=development

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

See `backend/README.md` for detailed Firebase Admin setup instructions.

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- API Docs: `http://localhost:3000/api-docs`

## Authentication Flow

This application follows **Firebase's best practice** for authentication:

1. **Client-side**: Firebase Auth SDK verifies password
2. **Client-side**: Gets ID token from Firebase
3. **Client → Backend**: Sends ID token to backend
4. **Backend**: Verifies ID token with Firebase Admin SDK
5. **Backend → Client**: Returns user information

**Why this approach?**
- ✅ Passwords never sent to backend (more secure)
- ✅ Firebase handles password verification
- ✅ Backend only verifies tokens (stateless)
- ✅ Industry standard practice

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (with ID token)
- `POST /api/auth/login` - Login user (with ID token)
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Blog Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (requires auth)
- `PUT /api/posts/:id` - Update post (requires auth)
- `DELETE /api/posts/:id` - Delete post (requires auth)

### File Upload
- `POST /api/upload` - Upload image (requires auth)

## Data Storage

- **Users**: Firebase Authentication
- **Posts**: Firestore collection `"object"` (matches Flutter app)
- **Files**: Firebase Storage

## Development

### Build for Production

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
cd backend
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Important Notes

1. **Firebase Auth SDK**: Required on frontend for password verification (best practice)
2. **Firebase Admin SDK**: Required on backend for token verification
3. **Collection Name**: Hardcoded to `"object"` to match Flutter app
4. **Token Storage**: ID tokens stored in `localStorage` (sent automatically via Axios interceptors)

## License

This is a learning/study project.
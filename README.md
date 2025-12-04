# Blog Application - React + TypeScript + Express Backend

A full-stack blog application with React frontend and Express.js backend, using MongoDB Atlas for database and JWT for authentication.

## Features

- ✅ **User Authentication**: Register, login, logout with JWT tokens
- ✅ **Blog Posts CRUD**: Create, read, update, and delete blog posts
- ✅ **Image Uploads**: Upload images to local storage
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
- **Axios** for API calls

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB Atlas** for cloud database
- **Mongoose** for MongoDB object modeling
- **JWT** (jsonwebtoken) for authentication
- **bcryptjs** for password hashing
- **Multer** for file upload handling
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
│   ├── network/                 # API client
│   │   └── api-client.ts       # Axios instance with interceptors
│   ├── redux/                   # Redux store and slices
│   ├── utils/                   # Utility functions
│   │   ├── auth.ts              # Authentication helpers
│   │   └── fileUpload.ts        # File upload helpers
│   └── App.tsx                  # Main app component
├── backend/                     # Backend Express server
│   ├── src/
│   │   ├── config/             # MongoDB connection
│   │   ├── models/             # Mongoose models (User, Post)
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Auth middleware
│   │   ├── services/            # JWT and password services
│   │   └── routes/              # API routes
│   └── README.md               # Backend documentation
├── .env                        # Frontend environment variables (optional)
└── .env.example                # Environment variables template
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier available)

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Configure Frontend Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
```

**Note:** This is optional. The default is `http://localhost:3000/api` if not set.

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogapp?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
NODE_ENV=development
```

See `backend/README.md` for detailed MongoDB Atlas setup instructions.

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

This application uses **JWT-based authentication**:

1. **Client → Backend**: User sends email/password to backend
2. **Backend**: Verifies password with bcrypt (hashed comparison)
3. **Backend**: Generates JWT token
4. **Backend → Client**: Returns JWT token + user info
5. **Client**: Stores JWT in localStorage
6. **All Requests**: Client sends JWT in `Authorization: Bearer <token>` header
7. **Backend**: Verifies JWT on protected routes

**Why this approach?**
- ✅ Standard JWT authentication pattern
- ✅ Stateless authentication (no server-side sessions)
- ✅ Secure password storage (bcrypt hashing)
- ✅ Industry standard practice

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
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

- **Users**: MongoDB `users` collection
- **Posts**: MongoDB `posts` collection
- **Files**: Local storage in `backend/uploads/images/`

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

1. **MongoDB Atlas**: Required for database (free tier available)
2. **JWT Tokens**: Stored in `localStorage` (sent automatically via Axios interceptors)
3. **Collection Names**: `users` for authentication, `posts` for blog posts
4. **File Storage**: Local storage in `uploads/images/` (consider cloud storage for production)

## License

This is a learning/study project.
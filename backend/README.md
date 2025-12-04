# Backend API - Blog Application

Express.js backend API with MongoDB Atlas integration for authentication, database, and local file storage.

## Features

- **Authentication**: User registration, login, logout, and current user retrieval using JWT tokens
- **Blog Posts CRUD**: Create, read, update, and delete blog posts stored in MongoDB
- **File Uploads**: Image uploads to local storage (`uploads/images/`)
- **API Documentation**: Swagger/OpenAPI documentation available at `/api-docs`
- **RESTful API**: Clean REST API endpoints for all operations

## Tech Stack

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
backend/
├── src/
│   ├── config/
│   │   └── mongodb.ts          # MongoDB connection
│   ├── models/
│   │   ├── User.ts             # User schema
│   │   └── Post.ts             # Post schema
│   ├── controllers/
│   │   ├── authController.ts   # Authentication logic
│   │   ├── postController.ts   # Blog posts CRUD operations
│   │   └── uploadController.ts # File upload handling
│   ├── middleware/
│   │   └── authMiddleware.ts   # JWT token verification
│   ├── services/
│   │   ├── jwtservice.ts       # JWT token generation/verification
│   │   └── passwordService.ts  # Password hashing with bcrypt
│   ├── routes/
│   │   ├── auth.ts            # Authentication routes
│   │   ├── posts.ts            # Blog posts routes
│   │   └── upload.ts          # File upload routes
│   └── server.ts              # Express server setup
├── uploads/
│   └── images/                # Local file storage
├── .env                       # Environment variables (not in git)
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3000

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogapp?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Environment
NODE_ENV=development
```

### 3. Get MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new project (or use existing)
3. Create a **M0 FREE** cluster
4. Create a **database user** (username + password)
5. **Whitelist IP address** (`0.0.0.0/0` for development)
6. Go to **Database** → **Connect** → **Connect your application**
7. Copy the connection string
8. Replace `<username>` and `<password>` with your database user credentials
9. Add your database name: `mongodb+srv://user:pass@cluster.mongodb.net/blogapp?retryWrites=true&w=majority`

### 4. Generate JWT Secret

Generate a strong secret key (minimum 32 characters):

**Online:** https://generate-secret.vercel.app/32

**PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 5. Run the Server

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
  - Body: `{ "email": "user@example.com", "password": "password123", "name": "John Doe" }`
- `POST /api/auth/login` - Login user
  - Body: `{ "email": "user@example.com", "password": "password123" }`
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current authenticated user

### Blog Posts

- `GET /api/posts` - Get all blog posts
- `GET /api/posts/:id` - Get a single post by ID
- `POST /api/posts` - Create a new post (requires auth)
  - Body: `{ "name": "Post Title", "image_name": "image.jpg", "image_url": "/uploads/images/image.jpg" }`
- `PUT /api/posts/:id` - Update a post (requires auth)
- `DELETE /api/posts/:id` - Delete a post (requires auth)

### File Upload

- `POST /api/upload` - Upload an image file (requires auth)
  - FormData: `{ "image": <file> }`
  - Returns: `{ "image_name": "photo-123.jpg", "image_url": "/uploads/images/photo-123.jpg" }`

### Health Check

- `GET /` - Server health check
- `GET /api/health/mongodb` - MongoDB connection status diagnostic

## API Documentation

Interactive API documentation is available at:
- **Swagger UI**: `http://localhost:3000/api-docs`

## How It Works

### Authentication Flow

1. **Client → Backend**: User sends email/password to backend
2. **Backend**: Verifies password with bcrypt (hashed comparison)
3. **Backend**: Generates JWT token
4. **Backend → Client**: Returns JWT token + user info
5. **Client**: Stores JWT in localStorage
6. **All Requests**: Client sends JWT in `Authorization: Bearer <token>` header
7. **Backend**: Verifies JWT on protected routes

### Data Storage

- **Users**: Stored in MongoDB `users` collection
  - Fields: `email` (unique), `password` (bcrypt hashed), `name`, `createdAt`, `updatedAt`
- **Posts**: Stored in MongoDB `posts` collection
  - Fields: `name`, `image_name`, `image_url`, `createdAt`, `updatedAt`
- **Files**: Saved locally in `uploads/images/` directory
  - Served statically at `/uploads/images/`
  - URLs stored in MongoDB: `/uploads/images/filename.jpg`

### Collection Structure

- **Collection Name**: `posts` (for blog posts)
- **Collection Name**: `users` (for authentication)
- **Documents**: Created automatically when first document is added
- **Timestamps**: Automatically added by Mongoose (`createdAt`, `updatedAt`)

## Important Notes

1. **MongoDB Collections**: Collections are created automatically when the first document is added. No manual creation needed.

2. **JWT Tokens**: Tokens are stateless and expire after 7 days (configurable via `JWT_EXPIRES_IN`).

3. **File Storage**: Files are uploaded to local `uploads/images/` directory, not cloud storage. For production, consider using cloud storage (AWS S3, Cloudinary, etc.).

4. **Authentication**: All `/api/posts` and `/api/upload` routes require authentication. Include the JWT token in the `Authorization: Bearer <token>` header.

5. **Password Security**: Passwords are hashed using bcrypt (10 salt rounds) before storage. Never stored in plain text.

## Development

### Project Structure Notes

- **Models**: Mongoose schemas for User and Post
- **Controllers**: Handle business logic and interact with MongoDB
- **Routes**: Define API endpoints and mount controllers
- **Middleware**: Handle authentication (JWT verification) and request processing
- **Services**: Utility functions (JWT, password hashing)
- **Config**: MongoDB connection setup

### Common Issues

**MongoDB connection failing:**
- Check `MONGODB_URI` is correct in `.env` file
- Verify username/password are correct
- Ensure IP address is whitelisted in MongoDB Atlas
- Check database name is included in connection string

**Posts not displaying:**
- Check MongoDB collection name is `posts`
- Verify documents exist in MongoDB Atlas
- Check backend logs for query results
- Ensure MongoDB connection is established

**Authentication failing:**
- Verify JWT token is being sent in `Authorization` header
- Check if token is expired (default: 7 days)
- Ensure `JWT_SECRET` is set in `.env` file
- Verify MongoDB connection is working

**File uploads not working:**
- Check `uploads/images/` directory exists
- Verify file size is under `MAX_FILE_SIZE` (default: 5MB)
- Ensure file is an image (jpeg, jpg, png, gif, webp)
- Check write permissions on `uploads/` directory

## License

This is a learning/study project.
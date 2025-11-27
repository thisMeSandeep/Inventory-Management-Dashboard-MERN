# 📦 Inventory Management Dashboard - MERN Stack

A full-stack **Inventory Management Dashboard** built with the **MERN stack** (MongoDB, Express.js, React, Node.js) featuring real-time updates, authentication, and modern UI/UX.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration with email verification
- Secure login with JWT-based authentication
- Password reset functionality
- Protected routes and role-based access control
- HTTP-only cookies for enhanced security

### 📊 Product Management

- Create, read, update, and delete products
- Product image upload with Cloudinary integration
- Real-time product updates via Socket.IO
- Product search and filtering
- Detailed product views with slug-based URLs
- Stock management and tracking

### 🎨 Modern UI/UX

- Responsive design with TailwindCSS v4
- React 19 with React Compiler for optimized performance
- Toast notifications for user feedback
- Loading states and spinners
- Clean and intuitive dashboard layout

### ⚡ Real-time Features

- Socket.IO integration for live updates
- Real-time product synchronization across clients
- Instant notifications

### 🛡️ Security & Performance

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Redis caching
- Input validation with Zod
- Bcrypt password hashing
- Morgan logging

---

## 🏗️ Tech Stack

### Frontend

- **React 19** - UI library with React Compiler
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **TailwindCSS v4** - Utility-first CSS framework
- **React Router v7** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **React Toastify** - Toast notifications
- **Lucide React** - Icon library

### Backend

- **Node.js** - Runtime environment
- **Express.js v5** - Web framework
- **TypeScript** - Type safety
- **MongoDB** with **Mongoose** - Database
- **Redis** - Caching layer
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **Resend** - Email service
- **Zod** - Schema validation
- **Winston** - Logging
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

---

## 📁 Project Structure

```
mern/
├── backend/                 # Backend server
│   ├── config/             # Configuration files (DB, Redis, Cloudinary)
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middlewares
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── templates/          # Email templates
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   ├── validations/        # Zod schemas
│   ├── app.ts              # Express app configuration
│   └── server.ts           # Server entry point
│
├── frontend/               # Frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── api/            # API client functions
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Route configurations
│   │   ├── schemas/        # Validation schemas
│   │   ├── store/          # Zustand stores
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # App entry point
│   └── package.json
│
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (v10.6.5 or higher)
- **MongoDB** (local or Atlas)
- **Redis** (local or cloud)
- **Cloudinary** account (for image uploads)
- **Resend** account (for email service)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mern
   ```

2. **Install dependencies**

   For backend:

   ```bash
   cd backend
   pnpm install
   ```

   For frontend:

   ```bash
   cd frontend
   pnpm install
   ```

3. **Environment Variables**

   Create `.env` files in both `backend` and `frontend` directories.

   **Backend `.env`:**

   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Redis
   REDIS_URL=your_redis_connection_string

   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Resend (Email)
   RESEND_API_KEY=your_resend_api_key
   FROM_EMAIL=your_verified_email

   # Client URLs
   CLIENT_URL=http://localhost:5173
   PROD_CLIENT_URL=your_production_url
   ```

   **Frontend `.env`:**

   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Run the application**

   Start backend (from `backend` directory):

   ```bash
   pnpm dev
   ```

   Start frontend (from `frontend` directory):

   ```bash
   pnpm dev
   ```

   The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

### 🐳 Docker Setup (Alternative)

You can also run the backend using Docker:

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Copy environment variables:**

   ```bash
   cp .env.example .env
   ```

3. **Update `.env` file** with your credentials (MongoDB and Redis URLs)

4. **Start with Docker Compose:**

   ```bash
   docker-compose up -d
   ```

5. **View logs:**

   ```bash
   docker-compose logs -f
   ```

6. **Stop:**
   ```bash
   docker-compose down
   ```

> **Note:** Make sure MongoDB and Redis are running (locally or cloud). Update your `.env` with the correct connection URLs.

For more details, see [backend/DOCKER.md](backend/DOCKER.md).

---

## 🔧 Available Scripts

### Backend

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### Frontend

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

---

## 📡 API Endpoints

### Authentication

- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/verify-email` - Verify email
- `POST /api/v1/user/login` - Login user
- `POST /api/v1/user/logout` - Logout user
- `GET /api/v1/user/me` - Get current user
- `POST /api/v1/user/forgot-password` - Request password reset
- `POST /api/v1/user/reset-password` - Reset password

### Products

- `GET /api/v1/product` - Get all products
- `GET /api/v1/product/:slug` - Get product by slug
- `POST /api/v1/product` - Create new product (protected)
- `PUT /api/v1/product/:slug` - Update product (protected)
- `DELETE /api/v1/product/:slug` - Delete product (protected)

---

## 🎯 Key Features Explained

### Real-time Updates

The application uses Socket.IO to provide real-time updates. When a product is created, updated, or deleted, all connected clients receive instant notifications and their UI updates automatically.

### Image Upload

Product images are uploaded to Cloudinary for reliable cloud storage. The backend handles file validation and upload, returning secure URLs for frontend display.

### Email Verification

New users receive verification emails via Resend. The system uses secure tokens for email verification and password reset flows.

### Caching

Redis is used for caching frequently accessed data and session management, improving application performance.

### Form Validation

Both frontend and backend use Zod schemas for consistent validation, ensuring data integrity across the stack.

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **HTTP-only Cookies** - Protection against XSS attacks
- **Password Hashing** - Bcrypt for secure password storage
- **Input Validation** - Zod schemas on both client and server
- **Rate Limiting** - Protection against brute force attacks
- **CORS Configuration** - Controlled cross-origin requests
- **Helmet.js** - Security headers
- **Trust Proxy** - Proper handling of proxy headers

---

## 🚢 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Set all environment variables in your hosting platform
2. Ensure MongoDB and Redis are accessible
3. Build command: `pnpm build`
4. Start command: `pnpm start`

### Frontend Deployment (Vercel/Netlify)

1. Connect your repository
2. Set build command: `pnpm build`
3. Set output directory: `dist`
4. Add environment variables (VITE_API_URL, VITE_SOCKET_URL)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [ISC License](LICENSE).

---

## 👨‍💻 Author

**Sandeep**

---

## 🙏 Acknowledgments

- React team for React 19 and React Compiler
- TailwindCSS team for the amazing CSS framework
- TanStack team for React Query
- Socket.IO team for real-time capabilities
- All open-source contributors

---

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Happy Coding! 🚀**

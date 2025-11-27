# 🐳 Docker Compose Setup

Run both frontend and backend together with Docker Compose.

## 🚀 Quick Start

### 1. Make sure your environment files are set up

**Backend `.env`** (in `backend/.env`):

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url
# ... other variables
```

**Frontend `.env`** (in `frontend/.env`):

```env
VITE_API_URL=http://backend:5000/api/v1
VITE_SOCKET_URL=http://backend:5000
```

> **Note:** In Docker Compose, services can communicate using their service names. The frontend uses `backend` as the hostname instead of `localhost`.

### 2. Start all services

```bash
docker-compose up -d
```

This will:

- Build both images (if not already built)
- Start backend on port 5000
- Start frontend on port 3000
- Create a network for them to communicate

### 3. View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 4. Access your application

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

---

## 🔧 Common Commands

**Stop all services:**

```bash
docker-compose down
```

**Rebuild and restart:**

```bash
docker-compose up -d --build
```

**View running containers:**

```bash
docker-compose ps
```

**Restart a specific service:**

```bash
docker-compose restart backend
docker-compose restart frontend
```

**View logs for specific service:**

```bash
docker-compose logs -f backend
```

**Execute command in container:**

```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

**Stop and remove everything (including volumes):**

```bash
docker-compose down -v
```

---

## 📦 What's Included

- **Backend:** Node.js API on port 5000
- **Frontend:** React app served by `serve` on port 3000
- **Network:** Both services communicate via `app-network`
- **Health Check:** Frontend waits for backend to be healthy before starting

---

## 🔄 Development Workflow

1. **Make code changes**
2. **Rebuild specific service:**

   ```bash
   docker-compose up -d --build backend
   # or
   docker-compose up -d --build frontend
   ```

3. **View logs to verify:**
   ```bash
   docker-compose logs -f
   ```

---

## 🐛 Troubleshooting

**Services won't start:**

```bash
docker-compose logs
```

**Port already in use:**

```bash
# Stop other containers using the ports
docker ps
docker stop <container_name>
```

**Rebuild from scratch:**

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Frontend can't connect to backend:**

- Check `frontend/.env` has `VITE_API_URL=http://backend:5000/api/v1`
- Rebuild frontend: `docker-compose up -d --build frontend`

---

## 📝 Notes

- Services communicate using service names (`backend`, `frontend`)
- The backend must be healthy before frontend starts
- MongoDB and Redis should be running (locally or cloud)
- Update connection strings in `backend/.env`

---

**That's it! Simple and clean. 🚀**

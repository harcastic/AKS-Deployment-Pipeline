# Cloud Gallery Platform

A production-grade cloud gallery storage platform built with Next.js, Node.js, Express, MongoDB, and Azure Blob Storage. Deployed via Docker, Kubernetes, and GitHub Actions.

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, shadcn/ui, Framer Motion, Axios, SWR
- **Backend:** Node.js, Express, Mongoose (MongoDB), Redis
- **Storage:** Azure Blob Storage
- **Infrastructure:** Docker, Kubernetes (AKS), Azure Container Registry (ACR), NGINX Ingress, GitHub Actions

## Features

- Secure user authentication (JWT + HTTP-only cookies)
- Distributed rate limiting via Redis
- Image uploads up to 5MB (JPEG, PNG, WebP)
- Strict user authorization (users can only access their own images)
- Modern SaaS-quality UI with dark mode support
- CI/CD pipeline for automated testing and deployment

## Setup Instructions

### Prerequisites

- Node.js 20+
- MongoDB
- Redis (optional for local, required for prod)
- Azure Storage Account

### Backend Setup

1. Navigate to `/backend`
2. Copy `.env.example` to `.env` and fill in the values
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`

### Frontend Setup

1. Navigate to `/frontend`
2. Copy `.env.local.example` (or similar) to `.env.local`
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`

## Deployment to AKS

### Prerequisites

1. Azure CLI installed and configured
2. `kubectl` installed
3. AKS cluster and ACR registry created
4. GitHub secrets configured (see CI/CD workflow)

### Steps

1. Build and push Docker images to ACR
2. Update `k8s/deployment.yaml` with your ACR image URIs
3. Update `k8s/secrets.yaml` with your base64-encoded secrets
4. Apply the K8s manifests:
   ```bash
   kubectl apply -f k8s/configmap.yaml
   kubectl apply -f k8s/secrets.yaml
   kubectl apply -f k8s/redis.yaml
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/frontend-deployment.yaml
   kubectl apply -f k8s/ingress.yaml
   ```

## API Documentation

### Auth

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user (clears cookie)

### Images

- `POST /api/images/upload` - Upload an image (requires auth, max 5MB, accepted types: jpeg, png, webp)
- `GET /api/images?page=1&limit=20` - Get all user's images with pagination
- `DELETE /api/images/:id` - Delete an image by ID (only owner)

## License

MIT

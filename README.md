# FiberLab: Numerical Aperture of an Optical Fiber

FiberLab is a virtual physics laboratory website developed for undergraduate engineering students. The application simulates the experimental determination of the Numerical Aperture (NA) and Acceptance Angle of a step-index multimode optical fiber using a 650 nm diode laser source and projection screen.

## Table of Contents
1. Project Architecture
2. Technology Stack
3. Prerequisites
4. Installation and Local Setup
5. Database Seeding
6. Running Locally
7. Running Unit Tests
8. Production Deployment Guide
9. Custom Domain and DNS Configuration
10. Image and Attribution Compliance
11. Verification Checklist

## 1. Project Architecture

The repository is structured as a full-stack MERN monorepo:
- `/client`: Frontend single page application built with React 18, Vite, Three.js, React Three Fiber, Tailwind CSS, Lucide icons, and KaTeX.
- `/server`: Backend REST API built with Node.js, Express, Mongoose, Helmet, Express-Rate-Limit, and Express-Validator.
- `/scripts`: Utility tools for favicon generation, SVG asset compilation, and code compliance verification.

## 2. Technology Stack

- **Frontend**: React 18, Vite, React Router, Tailwind CSS, Axios
- **3D Visualization**: Three.js, @react-three/fiber, @react-three/drei
- **Mathematics and Charts**: KaTeX, Recharts
- **Lab Report Generation**: jsPDF, jsPDF-autotable
- **Backend API**: Node.js, Express.js
- **Database**: MongoDB with Mongoose (Atlas or local instance)
- **Security**: Helmet security headers, rate limiting (200 requests / 15 minutes), CORS locking

## 3. Prerequisites

- Node.js version 18.0.0 or higher (v22.x recommended)
- npm version 9.0.0 or higher
- MongoDB instance (local daemon running on port 27017 or a MongoDB Atlas connection URI)

## 4. Installation and Local Setup

1. Clone or navigate to the project directory:
```bash
cd fiberlab
```

2. Install root and package dependencies:
```bash
npm run install:all
```
Alternatively, install individually:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

3. Configure environment variables:
Create a `.env` file in the root or server directory based on `.env.example`:
```bash
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/fiberlab
```

## 5. Database Seeding

Populate the MongoDB database with all apparatus specs, procedure steps, safety precautions, engineering applications, quiz questions, and verified sample observation data:
```bash
npm run seed
```

## 6. Running Locally

Run both the Express backend API and the Vite frontend development server concurrently:
```bash
npm run dev
```

- Frontend interface will be live at: `http://localhost:5173`
- Backend API server will be live at: `http://localhost:5000`
- API Health Check endpoint: `http://localhost:5000/api/health`

## 7. Running Unit Tests

Execute the backend mathematical verification suite:
```bash
npm test
```
The test suite verifies:
- Single reading calculation with L = 4.0 cm and D = 3.2 cm yields NA = 0.371 and theta = 21.8 degrees.
- 5-row table aggregation, arithmetic mean NA, and acceptance cone calculations.
- Strict input validation rejecting zero or negative values.
- Theoretical percentage error estimation.

## 8. Production Deployment Guide: Vercel + Render

### Step 1: Deploy Backend API on Render (Free Web Service)

1. Sign in to [Render](https://render.com) using your GitHub account.
2. Click **New +** and select **Web Service**.
3. Connect your repository: `Praveenpaila/fiber`.
4. Configure the Web Service settings:
   - **Name**: `fiberlab-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB Atlas connection URI string (e.g. `mongodb+srv://<user>:<password>@cluster0.mongodb.net/fiberlab?retryWrites=true&w=majority`)
   - `CLIENT_ORIGIN`: Your Vercel frontend URL (e.g. `https://fiberlab.vercel.app`)
6. Click **Create Web Service**. Once deployed, copy your Render API URL (e.g. `https://fiberlab-api.onrender.com`).

### Step 2: Deploy Frontend on Vercel (Global Edge Network)

1. Sign in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New...** and select **Project**.
3. Import your repository: `Praveenpaila/fiber`.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click Edit and select `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: Your Render backend URL from Step 1 (e.g. `https://fiberlab-api.onrender.com`)
6. Click **Deploy**. Vercel will build and launch your application at a permanent HTTPS address (e.g. `https://fiberlab.vercel.app`).
7. Update `CLIENT_ORIGIN` on your Render Web Service to match your assigned Vercel URL.

### Alternative Option: Unified Production Server on a Linux VPS (Ubuntu / Debian)

1. Provision an Ubuntu LTS server and install Node.js, Nginx, and PM2:
```bash
sudo apt update && sudo apt install -y nodejs npm nginx
sudo npm install -g pm2
```

2. Build the client bundle:
```bash
npm --prefix client run build
```

3. Start the Express API with PM2:
```bash
cd server
pm2 start src/server.js --name "fiberlab-api"
pm2 save
```

4. Configure Nginx reverse proxy and static site:
Edit `/etc/nginx/sites-available/fiberlab`:
```nginx
server {
    server_name fiberlab.physics.edu www.fiberlab.physics.edu;

    root /var/www/fiberlab/client/dist;
    index index.html;

    # Static assets caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API Proxy to Express
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 9. Custom Domain and DNS Configuration

To connect a custom domain (such as `fiberlab.physics.edu`):

### Step 1: DNS Records Configuration
In your domain registrar DNS dashboard (such as Cloudflare, Route 53, or Namecheap), configure the following DNS records:

| Record Type | Host / Name | Target / Value | TTL |
| :--- | :--- | :--- | :--- |
| A | `@` (apex) | `203.0.113.10` (Your server IP address) | Auto / 300 |
| CNAME | `www` | `fiberlab.physics.edu` | Auto / 300 |

### Step 2: SSL Certificate and HTTPS Encryption
Install Certbot to provision free Let's Encrypt TLS certificates:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d fiberlab.physics.edu -d www.fiberlab.physics.edu
```

Select the option to automatically redirect all HTTP traffic to HTTPS.

### Step 3: Canonical WWW to Non-WWW Redirect
Ensure that all `www` requests redirect cleanly to the primary domain by adding this block to Nginx:
```nginx
server {
    listen 443 ssl http2;
    server_name www.fiberlab.physics.edu;

    ssl_certificate /etc/letsencrypt/live/fiberlab.physics.edu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fiberlab.physics.edu/privkey.pem;

    return 301 https://fiberlab.physics.edu$request_uri;
}
```

Reload Nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 10. Image and Attribution Compliance

In accordance with strict laboratory honesty standards:
- All assets are stored locally in `/client/public/images/`.
- No AI-generated photos or generic stock photos are used.
- Technical diagrams are vector SVGs with clean engineering callouts.
- A dedicated `/credits` page catalogs all authors, source URLs, and Creative Commons licenses.

## 11. Verification Checklist

The application satisfies all verification checks:
1. Clean install and seeding: `npm install`, `npm run seed`, `npm run dev` execute with zero errors.
2. Unit tests pass with 100% accuracy. Hand-calculation check (L = 4.0 cm, D = 3.2 cm yields NA = 0.371).
3. Built distribution and source code contain zero emojis, zero em dashes, zero purple gradients, zero platform watermarks, and zero fake customer metrics.
4. Labeled diagrams and photographic references cataloged on `/credits`.
5. Legal pages (`/privacy` and `/terms`) provide transparent data retention and deletion policies.
6. Favicons, manifest, SEO meta tags, `robots.txt`, and `sitemap.xml` are active.
7. Responsive layout verified down to 375px mobile viewport.
8. Interactive 3D models and assembled optical bench operate with WebGL fallbacks.
9. Observations save, reload, and delete from MongoDB with A4 PDF lab report export.
10. Production DNS, HTTPS, and deployment steps fully documented.
#   f i b e r  
 

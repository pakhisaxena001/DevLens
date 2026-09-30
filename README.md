# DevLens

### AI-Powered GitHub Repository Analysis Platform

> Analyze GitHub repositories, understand project health, and get AI-powered insights from repository data.

**Live Demo:** (https://devlens-beryl-one.vercel.app/)

---

## About

DevLens is a full-stack web application that analyzes GitHub repositories and provides a structured overview of their health, activity, and maintainability.

Instead of manually inspecting commits, contributors, issues, pull requests, languages, and other repository signals, DevLens brings these metrics together into a single dashboard.

The platform combines GitHub API data with Google Gemini to provide both quantitative repository metrics and AI-generated insights.

---

## Features

### Repository Analysis

- Repository health analysis
- Code quality metrics
- Community activity analysis
- Maintainer support analysis
- Beginner-friendly score
- Programming language analysis
- Commit activity
- Issue analysis
- Pull request analysis
- Contributor analysis

### Dashboard

- Interactive repository health dashboard
- Visual analytics and charts
- Repository statistics
- Contributor information
- Language distribution
- Activity metrics
- Overall project health score

### AI Insights

- AI-generated repository analysis
- Contextual project insights
- Strength and improvement identification
- Repository activity interpretation
- Developer-focused recommendations

### User Features

- User registration and login
- JWT authentication
- User profile
- Repository bookmarks
- Analysis history
- Repository comparison
- Saved repository analyses

---

## How It Works

```text
GitHub Repository
       |
       v
   GitHub API
       |
       v
Repository Data
       |
       v
Analysis Engine
       |
       +-------------------+
       |                   |
       v                   v
Health Metrics       Google Gemini
       |                   |
       |             AI Insights
       |                   |
       +---------+---------+
                 |
                 v
          PostgreSQL
                 |
                 v
        DevLens Dashboard
Tech Stack
Frontend
Vue.js
Vite
Tailwind CSS
Chart.js
Backend
Node.js
Express.js
Prisma ORM
PostgreSQL
APIs and Services
GitHub API
Google Gemini API
Neon PostgreSQL
Render
Vercel
Architecture
                    DEV LENS
                       |
          +------------+------------+
          |                         |
          v                         v
     Vue Frontend              Express Backend
     Vite + Tailwind           Node.js + REST API
     + Chart.js                      |
          |                          |
          |              +-----------+-----------+
          |              |                       |
          |              v                       v
          |         GitHub API             Google Gemini
          |              |                       |
          |              +-----------+-----------+
          |                          |
          |                          v
          |                    Analysis Services
          |                          |
          |                          v
          |                    PostgreSQL
          |                          |
          +--------------------------+
Repository Health Analysis

DevLens uses multiple repository signals to generate its analysis.

Metric	Description
Code Quality	Repository and development quality indicators
Community Activity	Contributor, issue, and pull request activity
Maintainer Support	Repository maintenance and maintainer activity
Project Health	Combined repository health indicators
Beginner Friendly	Indicators related to repository accessibility for new contributors

These metrics are derived from available GitHub repository data and are intended to provide analytical context rather than an absolute measurement of software quality.

AI-Powered Analysis

DevLens integrates Google Gemini into the repository analysis workflow.

Repository information and calculated metrics are processed by the backend before being provided to the AI service.

The resulting insights help users understand repository characteristics beyond raw numerical statistics.

The AI analysis can highlight:

Project strengths
Potential improvement areas
Development activity
Community characteristics
Maintainer activity
General repository characteristics
Screenshots
Dashboard

The dashboard provides an overview of repository health, metrics, activity, and analysis results.

Repository Analysis

Users can analyze a GitHub repository and view detailed repository metrics.

AI Insights

AI-generated insights provide additional context around the repository analysis.

Project Structure
DevLens/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   │
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── database/
│   ├── generated/
│   ├── package.json
│   └── prisma.config.ts
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── services/
│   │   └── stores/
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
Getting Started
Prerequisites

Make sure you have the following installed:

Node.js
npm
Git
PostgreSQL

You will also need:

GitHub API credentials
Google Gemini API credentials
Clone the Repository
git clone <your-github-repository-url>
cd DevLens
Backend Setup
cd Backend
npm install

Create a .env file using .env.example.

Configure the required environment variables:

NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=devlens_db
DB_USER=postgres
DB_PASSWORD=your_password

DATABASE_URL=your_database_url

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

GITHUB_TOKEN=your_github_token
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

GEMINI_API_KEY=your_gemini_api_key

CORS_ORIGIN=http://localhost:5173

Generate the Prisma client:

npx prisma generate

Run database migrations:

npx prisma migrate deploy

Start the backend:

npm run dev

The backend runs on port 5000 by default.

Frontend Setup

Open another terminal:

cd Frontend
npm install

Create a .env file:

VITE_API_BASE_URL=http://localhost:5000/api

Start the frontend:

npm run dev

The Vite development server runs on port 5173 by default.

Environment Variables

Sensitive credentials must not be committed to the repository.

Important environment variables include:

DATABASE_URL
JWT_SECRET
JWT_EXPIRE
GITHUB_TOKEN
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GEMINI_API_KEY
CORS_ORIGIN
VITE_API_BASE_URL

Production credentials are configured through the respective deployment platforms.

Deployment

DevLens is deployed using a separate frontend, backend, and database architecture.

Component	Platform
Frontend	Vercel
Backend	Render
Database	Neon PostgreSQL
Repository Data	GitHub API
AI	Google Gemini
Production Frontend

devlens-beryl-one.vercel.app

Production Backend

The backend is hosted on Render and exposes the REST API consumed by the frontend.

Database

DevLens uses PostgreSQL for persistent application data.

Prisma ORM is used for:

Database schema management
Database queries
Migrations
Type-safe database access

The database stores information related to:

Users
Repositories
Repository analyses
Repository metrics
Analysis history
Contributors
Bookmarks
AI-generated insights

The production database is hosted on Neon PostgreSQL.

Authentication

DevLens uses JWT-based authentication.

Authentication protects user-specific functionality including:

User profiles
Analysis history
Bookmarks
Saved repositories
Other protected resources

Passwords and authentication secrets are handled by the backend and are not stored in the source repository.

API Health Check

The backend provides a health endpoint:

GET /health

A successful response looks like:

{
  "status": "ok",
  "timestamp": "..."
}
Production Architecture
                         Vercel
                           |
                           v
                  DevLens Frontend
                           |
                       HTTPS API
                           |
                           v
                         Render
                           |
                           v
                  Node.js / Express
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
        GitHub API    Google Gemini   Neon PostgreSQL
Security

DevLens implements several security mechanisms:

JWT-based authentication
Password hashing
Protected API routes
CORS configuration
Helmet security middleware
API rate limiting
Input validation
Environment-based secret management

Production secrets are stored in deployment environment variables and are not committed to source control.

Future Improvements

Potential future improvements include:

Advanced repository health metrics
More detailed contributor analytics
Repository activity trends
Improved AI recommendations
Automated repository monitoring
Exportable analysis reports
Additional repository comparison capabilities
Support for private repositories
Additional GitHub integrations
Project Objective

The goal of DevLens is to simplify GitHub repository analysis by combining repository data, software engineering metrics, data visualization, and generative AI into a single platform.

The project demonstrates the integration of:

Modern frontend development
REST API architecture
Relational database management
Third-party API integration
Authentication and authorization
Data visualization
Generative AI
License

This project was developed for educational and project demonstration purposes.


### And one correction

I deliberately **didn't put a giant Table of Contents, 15 paragraphs of explanation, fake badges, or unnecessary documentation around every folder**. That's what made the previous version feel like a project report.

For a GitHub README, the hierarchy should be:

**What is it → Demo → Features → Screenshots → Tech → Architecture → Setup → Deployment.**

One thing you should do before committing: under **Screenshots**, actually add your DevLens 


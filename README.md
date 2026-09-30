# DevLens

## AI-Powered GitHub Repository Analysis Platform

[Live Application](https://devlens-beryl-one.vercel.app)

DevLens is an AI-powered platform that analyzes GitHub repositories and provides a clear, structured view of project health, development activity, and overall repository quality.

It brings together repository data, engineering metrics, interactive visualizations, and AI-generated insights to help developers understand a GitHub project without manually going through multiple repository statistics.

---

## Overview

GitHub repositories contain a wide range of information including commits, contributors, issues, pull requests, programming languages, and repository activity.

Understanding all of these factors can be time-consuming, especially when evaluating an unfamiliar project.

DevLens simplifies this process by collecting relevant repository information and presenting it through an intuitive dashboard with meaningful metrics and AI-powered insights.

---

## Key Features

### Repository Analysis

DevLens provides a comprehensive analysis of GitHub repositories, including:

- Overall repository health
- Code quality
- Community activity
- Maintainer support
- Beginner-friendliness
- Repository activity
- Programming language distribution
- Commit activity
- Issues
- Pull requests
- Contributors

### Repository Health Score

DevLens combines multiple repository indicators to provide an overall project health score.

The score gives users a quick way to understand the general state and activity of a repository.

### Code Quality Analysis

The platform evaluates repository-related indicators to provide insights into code quality and development practices.

### Community Activity

DevLens analyzes contributors, issues, pull requests, and repository activity to provide an overview of the project's community engagement.

### Maintainer Support

Repository maintenance and activity are analyzed to provide insights into maintainer involvement and project support.

### Beginner-Friendly Score

DevLens provides a dedicated beginner-friendly assessment to help users understand how approachable a repository may be for developers who are new to the project.

### AI-Powered Insights

DevLens uses Google Gemini to generate contextual insights from repository analysis data.

AI-generated insights help explain repository characteristics in a more understandable way and highlight:

- Project strengths
- Potential areas for improvement
- Development activity
- Community characteristics
- Maintainer activity
- General project observations

### Interactive Dashboard

The analysis results are presented through an interactive dashboard with visual representations of repository metrics.

Users can explore repository health, activity, contributors, languages, and other relevant information from a centralized interface.

### Analysis History

Users can access their previous repository analyses and review analysis results over time.

### Repository Bookmarks

Repositories can be bookmarked for quick access and future reference.

### Repository Comparison

DevLens allows users to compare repositories and examine their metrics side by side.

### User Profiles

Users can maintain their own profiles and access their repository analyses, bookmarks, and history.

### Authentication

DevLens provides secure user authentication for accessing personalized features and saved data.

---

## How DevLens Works

The analysis process follows a simple workflow:

**1. Select a Repository**

Provide a GitHub repository to analyze.

**2. Collect Repository Data**

DevLens retrieves relevant information from GitHub, including repository statistics, commits, contributors, issues, pull requests, and languages.

**3. Analyze Repository Metrics**

The collected information is processed to calculate repository health and other project metrics.

**4. Generate AI Insights**

Google Gemini analyzes relevant repository information and generates contextual insights.

**5. Explore Results**

All metrics and insights are presented through the DevLens dashboard.

---

## What DevLens Helps With

DevLens can be useful when:

- Evaluating an unfamiliar GitHub repository
- Understanding the health of an open-source project
- Exploring projects before contributing
- Identifying active and maintained repositories
- Understanding repository activity
- Comparing different projects
- Getting a quick overview of a project's development status
- Finding repositories that may be approachable for beginners

---

## Technology Stack

### Frontend

- Vue.js
- Vite
- Tailwind CSS
- Chart.js

### Backend

- Node.js
- Express.js
- Prisma
- PostgreSQL

### AI and APIs

- GitHub API
- Google Gemini

### Deployment

- Vercel
- Render
- Neon PostgreSQL

---

## Application Architecture

DevLens follows a full-stack architecture connecting the frontend, backend, external APIs, AI services, and database.

```text
                    DevLens
                       |
          +------------+------------+
          |                         |
          v                         v
      Frontend                  Backend API
          |                         |
          |              +----------+----------+
          |              |                     |
          |              v                     v
          |         GitHub API          Google Gemini
          |              |                     |
          |              +----------+----------+
          |                         |
          |                         v
          |                    PostgreSQL
          |                         |
          +-------------------------+
                       |
                       v
                  Dashboard

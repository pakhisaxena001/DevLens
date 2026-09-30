# DevLens Frontend

An AI-powered repository intelligence platform frontend built with Vue 3, Vite, Pinia, and Tailwind CSS.

## 🚀 Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Pinia** - State management
- **Vue Router** - Official router for Vue.js
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Vue** - Beautiful SVG icons

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── common/         # Generic components (StatsCard, Modal, etc.)
│   ├── navbar/         # Navigation components
│   ├── sidebar/        # Sidebar navigation
│   ├── dashboard/      # Dashboard-specific components
│   ├── repository/     # Repository analysis components
│   ├── bookmarks/      # Bookmarks components
│   ├── compare/        # Comparison components
│   ├── history/        # History components
│   ├── profile/        # Profile components
│   └── landing/        # Landing page components
├── pages/              # Page components (routes)
│   ├── Landing.vue     # Public landing page
│   ├── Login.vue       # User login
│   ├── Register.vue    # User registration
│   ├── Dashboard.vue   # Main dashboard
│   ├── Analyze.vue     # Repository analysis form
│   ├── Repository.vue  # Repository details
│   ├── AIInsights.vue  # AI insights & recommendations
│   ├── History.vue     # Analysis history
│   ├── Bookmarks.vue   # Bookmarked repositories
│   ├── Compare.vue     # Repository comparison
│   └── Profile.vue     # User profile & settings
├── layouts/            # Layout components
│   ├── AuthLayout.vue  # Layout for auth pages
│   └── DashboardLayout.vue # Layout for app pages
├── router/             # Vue Router configuration
│   └── index.js        # Route definitions & guards
├── stores/             # Pinia stores
│   ├── auth.js         # Authentication store
│   ├── dashboard.js    # Dashboard data store
│   ├── repository.js   # Repository analysis store
│   ├── bookmark.js     # Bookmarks store
│   ├── compare.js      # Comparison store
│   ├── history.js      # History store
│   └── profile.js      # Profile store
├── services/           # API service layer
├── composables/        # Vue composables
├── utils/              # Utility functions
├── assets/             # Static assets
├── App.vue             # Root component
├── main.js             # Application entry point
└── style.css           # Global styles
```

## 🎯 Main Pages

### Public Pages
- **Landing** (`/`) - Hero section with features and CTA
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration

### Protected Pages (Requires Authentication)
- **Dashboard** (`/dashboard`) - Main dashboard with stats and recent analyses
- **Analyze** (`/analyze`) - Repository analysis form
- **Repository** (`/repository`) - Repository analysis results and metrics
- **AI Insights** (`/insights`) - AI-generated insights and recommendations
- **History** (`/history`) - Analysis history and timeline
- **Bookmarks** (`/bookmarks`) - Saved repositories
- **Compare** (`/compare`) - Side-by-side repository comparison
- **Profile** (`/profile`) - User profile and settings

## 🔐 Authentication

The app uses JWT-based authentication with the following flow:

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token sent with every API request via Authorization header
5. Navigation guards protect routes that require authentication

## 🗂️ State Management (Pinia)

### auth.js
- Manages user authentication state
- Handles login, register, logout, and session restoration
- Stores user data and authentication token

### dashboard.js
- Manages dashboard data (stats, recent analyses, activity)
- Fetches dashboard-specific information

### repository.js
- Manages repository analysis state
- Handles repository analysis requests and results

### bookmark.js
- Manages bookmarked repositories
- CRUD operations for bookmarks

### compare.js
- Manages repositories selected for comparison
- Comparison data operations

### history.js
- Manages analysis history
- Fetch and delete analysis records

### profile.js
- Manages user profile data
- Update profile and password change operations

## 🚦 Navigation & Routing

Routes are configured in `router/index.js` with the following features:

- **Layout-based routing** - Different layouts for auth and dashboard pages
- **Navigation guards** - Automatic authentication checks
- **Meta fields** - Route metadata for access control
- **Nested routes** - Child routes use parent layouts

## 🎨 Styling

- **Tailwind CSS** - All styles use Tailwind utility classes
- **Responsive Design** - Mobile-first approach
- **Dark Mode Ready** - Can be extended with dark mode support
- **Custom Colors** - Green (#2f6b3e) as primary, Gray (#111827) as secondary

## 📝 Environment Setup

### Prerequisites
- Node.js ^22.18.0 || >=24.12.0

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Format code
npm run format
```

## 🔄 Component Communication

### Props & Emits
- Components accept data via props
- Components emit events for state changes

### Provide/Inject
- Can be used for deeply nested components

### Pinia Stores
- Centralized state management for complex data flows

## 🌐 API Integration

API calls should be made through dedicated service layers:

```javascript
// Example API call from a store
const response = await fetch('/api/endpoint', {
  method: 'GET/POST/PUT/DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
})
```

## 📦 Key Dependencies

- `vue@^3.5.40` - Vue framework
- `vue-router@^5.2.0` - Client-side routing
- `pinia@^4.0.2` - State management
- `tailwindcss@^4.3.3` - Utility CSS
- `@lucide/vue@^1.28.0` - Icons
- `@tailwindcss/vite@^4.3.3` - Tailwind Vite plugin

## 🛠️ Development

### Best Practices

1. **Component naming** - Use PascalCase for component files
2. **Store naming** - Use camelCase for store files
3. **Routing** - Keep routes organized by feature
4. **Styling** - Use Tailwind classes, avoid custom CSS when possible
5. **API** - Always use stores for API calls, not components directly

### Adding New Pages

1. Create page component in `src/pages/`
2. Create corresponding store in `src/stores/` if needed
3. Add route to `src/router/index.js`
4. Create layout if needed
5. Add navigation link in appropriate component

### Adding New Components

1. Create component file in appropriate subdirectory under `src/components/`
2. Use `<script setup>` for modern syntax
3. Define props and emits clearly
4. Add Tailwind classes for styling
5. Export as default export

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deployment to Vercel/Netlify

```bash
# The dist/ folder is what gets deployed
# Configure your deployment platform to run:
# - Build command: npm run build
# - Output directory: dist
```

## 📱 Responsive Breakpoints

Tailwind CSS responsive prefixes used:

- `sm` - 640px
- `md` - 768px
- `lg` - 1024px
- `xl` - 1280px
- `2xl` - 1536px

## 🔗 Related Documentation

- [Vue 3 Documentation](https://vuejs.org)
- [Vite Documentation](https://vitejs.dev)
- [Pinia Documentation](https://pinia.vuejs.org)
- [Vue Router Documentation](https://router.vuejs.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)

## 📄 License

This project is part of DevLens - AI-Powered Repository Intelligence Platform.

---

**Note**: Replace API endpoints with actual backend URLs when integrating with the backend service.

"# Manifest 12 - 12-Week Goal Manifestation Platform

A comprehensive goal manifestation platform integrating **Law of Attraction** and **Neville Goddard** teachings to help users achieve their goals through structured 12-week cycles.

## 🌟 Overview

Manifest 12 is a full-stack web application that guides users through a transformative 12-week journey of goal setting, manifestation practices, and progress tracking. The platform combines modern psychology with spiritual teachings to create a powerful goal achievement system.

## ✨ Key Features

### 🎯 Core Functionality
- **User Authentication** - Secure JWT-based authentication with password reset
- **12-Week Cycles** - Create and manage structured 12-week manifestation cycles
- **Goal Management** - Set goals with Law of Attraction \"why\" statements and Neville Goddard visualizations
- **Weekly Check-ins** - Track progress with weekly reflections and mood ratings
- **Progress Tracking** - Visual progress indicators, milestone tracking, and analytics
- **Analytics Dashboard** - Comprehensive insights into cycle completion, goal progress, and manifestation tracking

### 🧘 Law of Attraction Integration
- \"Why\" statements for each goal to clarify intention
- Manifestation tracking with weekly reflections
- Daily inspiration and affirmations
- Gratitude and visualization practices

### 📊 Analytics & Insights
- Cycle completion rates
- Goal progress tracking
- Mood trends over time
- Manifestation count and patterns
- Progress history with snapshots

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **CRACO** - Create React App Configuration Override

### Backend
- **FastAPI** - High-performance Python web framework
- **Motor** - Async MongoDB driver
- **PyJWT** - JSON Web Token implementation
- **Passlib** - Password hashing with bcrypt
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server

### Database
- **MongoDB** - NoSQL database for flexible document storage

### DevOps
- **Supervisor** - Process control system
- **Nginx** - Reverse proxy (for code-server)
- **Docker/Kubernetes** - Container orchestration (Emergent deployment)

## 📁 Project Structure

```
/app/
├── backend/                      # FastAPI backend application
│   ├── server.py                 # Main application file with all API endpoints
│   ├── requirements.txt          # Python dependencies
│   └── .env                      # Backend environment variables
│
├── frontend/                     # React frontend application
│   ├── public/                   # Static files
│   │   ├── index.html           # HTML template
│   │   ├── favicon.ico          # App icon
│   │   └── manifest.json        # PWA manifest
│   │
│   ├── src/                      # Source code
│   │   ├── components/          # Reusable React components
│   │   │   ├── auth/           # Authentication components
│   │   │   │   ├── Login.jsx                # Login form with validation
│   │   │   │   ├── Register.jsx             # Registration form with password validation
│   │   │   │   ├── ForgotPassword.jsx       # Password reset request form
│   │   │   │   └── ResetPassword.jsx        # Password reset confirmation form
│   │   │   │
│   │   │   ├── cycles/          # Cycle management components
│   │   │   │   └── CreateCycle.jsx          # 12-week cycle creation modal
│   │   │   │
│   │   │   ├── goals/           # Goal management components
│   │   │   │   ├── CreateGoal.jsx           # Goal creation with Law of Attraction integration
│   │   │   │   └── GoalDetailsModal.jsx     # Goal details, progress updates, milestones
│   │   │   │
│   │   │   ├── calendar/        # Calendar components
│   │   │   │   └── TwelveWeekCalendar.jsx   # Interactive 12-week calendar grid
│   │   │   │
│   │   │   ├── reflections/     # Reflection components
│   │   │   │   └── WeeklyCheckIn.jsx        # Weekly reflection and check-in modal
│   │   │   │
│   │   │   └── visualization/   # Analytics and visualization components
│   │   │       ├── CycleProgressRing.jsx    # Circular progress indicator for cycles
│   │   │       ├── ProgressCharts.jsx       # Charts for analytics
│   │   │       └── AnalyticsDashboard.jsx   # Comprehensive analytics dashboard
│   │   │
│   │   ├── context/             # React Context providers
│   │   │   └── AuthContext.js               # Authentication state management
│   │   │
│   │   ├── pages/               # Page components
│   │   │   └── Dashboard.jsx                # Main dashboard with cycle and goal overview
│   │   │
│   │   ├── App.js               # Main app component with routing
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles with Tailwind imports
│   │
│   ├── package.json             # Node dependencies and scripts
│   ├── craco.config.js          # CRACO configuration for proxy
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   └── .env                     # Frontend environment variables
│
├── memory/                       # Persistent data storage
│   └── test_credentials.md      # Test user credentials for development
│
├── test_result.md               # Testing history and results
└── README.md                    # This file

```

## 📄 File Descriptions

### Backend Files

#### `backend/server.py` (765 lines)
The main FastAPI application containing all backend logic:

**Data Models:**
- `User`, `UserCreate`, `UserLogin` - User authentication models
- `Cycle`, `CycleCreate`, `CycleUpdate` - 12-week cycle management
- `Goal`, `GoalCreate`, `GoalUpdate` - Goal with Law of Attraction integration
- `Milestone` - Goal milestone tracking
- `WeeklyReflection`, `WeeklyReflectionCreate` - Weekly check-in data
- `PasswordResetRequest`, `PasswordResetConfirm`, `PasswordResetToken` - Password reset flow
- `GoalProgressSnapshot`, `GoalProgressHistory` - Progress tracking over time
- `CycleAnalytics`, `DashboardAnalytics` - Analytics data models
- `Token`, `StatusCheck` - Utility models

**API Endpoints:**

*Authentication:*
- `POST /api/auth/register` - User registration with password validation (min 6 chars)
- `POST /api/auth/login` - User login with JWT token generation
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/forgot-password` - Request password reset token
- `POST /api/auth/reset-password` - Confirm password reset with token

*Cycle Management:*
- `POST /api/cycles` - Create new 12-week cycle
- `GET /api/cycles` - Get user's cycles
- `GET /api/cycles/{cycle_id}` - Get specific cycle
- `PUT /api/cycles/{cycle_id}` - Update cycle details
- `POST /api/cycles/{cycle_id}/complete` - Mark cycle as completed
- `GET /api/cycles/{cycle_id}/analytics` - Get cycle analytics

*Goal Management:*
- `POST /api/goals` - Create goal with Law of Attraction integration
- `GET /api/goals` - Get user's goals (optional cycle filter)
- `GET /api/goals/{goal_id}` - Get specific goal
- `PUT /api/goals/{goal_id}` - Update goal progress and status
- `POST /api/goals/{goal_id}/progress` - Record progress snapshot
- `GET /api/goals/{goal_id}/progress-history` - Get progress timeline

*Weekly Reflections:*
- `POST /api/reflections` - Create weekly reflection
- `GET /api/reflections` - Get reflections (optional cycle filter)
- `GET /api/reflections/{reflection_id}` - Get specific reflection

*Analytics:*
- `GET /api/analytics/dashboard` - Get comprehensive dashboard analytics
- `GET /api/status` - Health check endpoint

**Security Features:**
- JWT token authentication with 7-day expiration
- Bcrypt password hashing
- Email validation
- Protected routes with dependency injection
- Secure password reset with token expiration

**Performance Optimizations:**
- Database query projections (field selection)
- Query limits (max 100 records per request)
- Async/await for non-blocking I/O

#### `backend/requirements.txt`
Python package dependencies:
- `fastapi` - Web framework
- `uvicorn[standard]` - ASGI server
- `motor` - Async MongoDB driver
- `pydantic[email]` - Data validation with email support
- `python-dotenv` - Environment variable management
- `passlib[bcrypt]` - Password hashing
- `PyJWT` - JWT token handling
- `email-validator` - Email validation

#### `backend/.env`
Environment configuration:
```env
MONGO_URL=mongodb://localhost:27017    # MongoDB connection string
DB_NAME=manifest12                     # Database name
SECRET_KEY=<secure-random-key>         # JWT signing key (32-byte secure)
WDS_SOCKET_PORT=443                    # WebSocket port for dev server
```

### Frontend Files

#### `frontend/src/App.js`
Main application component with React Router setup:
- Route definitions for all pages
- Public routes (login, register, forgot password, reset password)
- Protected routes (dashboard)
- Authentication flow integration

#### `frontend/src/index.js`
React application entry point:
- ReactDOM rendering
- AuthProvider wrapper for global auth state
- Router integration

#### `frontend/src/context/AuthContext.js`
Authentication context provider:
- User state management
- Token storage (localStorage)
- Login/logout/register functions
- Axios default headers for authentication
- Protected route logic

#### Authentication Components

**`frontend/src/components/auth/Login.jsx`**
- Email and password form
- Form validation
- Error handling
- Navigation to register and forgot password
- JWT token storage on success

**`frontend/src/components/auth/Register.jsx`**
- Registration form with full name, email, password, confirm password
- Client-side validation:
  - Password length (min 6 characters)
  - Password match validation
  - Email format validation
- Server-side validation integration
- Automatic login after registration

**`frontend/src/components/auth/ForgotPassword.jsx`**
- Email input for password reset request
- Token display for development (sent via email in production)
- Success/error messaging
- Link to login page

**`frontend/src/components/auth/ResetPassword.jsx`**
- Token validation on mount
- New password form with confirmation
- Password strength validation
- Token expiration handling
- Automatic redirect to login on success

#### Dashboard Components

**`frontend/src/pages/Dashboard.jsx`**
Main user dashboard with:
- User welcome section with personalized greeting
- Cycle statistics (active cycles, total goals, completion rates)
- Current cycle overview with progress ring
- Goal list for active cycle
- Quick action buttons (Create Cycle, Create Goal, Weekly Check-in)
- Daily inspiration section
- 12-week calendar view
- Analytics dashboard integration
- Modal management for all create/edit actions

#### Cycle Components

**`frontend/src/components/cycles/CreateCycle.jsx`**
12-week cycle creation modal:
- Title and description inputs
- Law of Attraction statement (intention setting)
- Start date selection
- Duration configuration (default 12 weeks)
- API integration for cycle creation
- Success callback to refresh parent component

#### Goal Components

**`frontend/src/components/goals/CreateGoal.jsx`**
Goal creation modal with Law of Attraction integration:
- Goal title and description
- Category selection (Health, Career, Relationships, Finance, Personal Growth, Spiritual)
- Start week and target week selection
- Law of Attraction \"Why\" statement (purpose and intention)
- Neville Goddard visualization note (mental imagery practice)
- Milestone management (add/remove milestones)
- API integration
- Form validation

**`frontend/src/components/goals/GoalDetailsModal.jsx`**
Comprehensive goal management interface:
- Goal information display
- Progress slider (0-100%)
- Progress notes input
- Milestone completion tracking
- Progress history timeline
- Status updates (not_started, in_progress, completed, on_hold)
- Law of Attraction review section
- API integration for updates
- Progress snapshot recording

#### Calendar Components

**`frontend/src/components/calendar/TwelveWeekCalendar.jsx`**
Interactive 12-week calendar grid:
- Week-by-week visualization
- Current week highlighting
- Week selection for reflections
- Goal distribution across weeks
- Reflection status indicators
- Week details view
- Integration with goals data
- Click handlers for weekly check-ins

#### Reflection Components

**`frontend/src/components/reflections/WeeklyCheckIn.jsx`**
Comprehensive weekly reflection modal:
- Progress review text area
- Law of Attraction manifestations list (dynamic add/remove)
- Neville Goddard visualization practice notes
- Challenges documentation
- Insights and learnings
- Next week focus areas (dynamic list)
- Mood rating (1-10 scale with emoji indicators)
- API integration for reflection creation
- Form validation and submission

#### Visualization Components

**`frontend/src/components/visualization/CycleProgressRing.jsx`**
Circular progress indicator:
- SVG-based progress ring
- Percentage display
- Animated fill based on completion
- Color coding for progress levels
- Responsive sizing
- Reusable component for various metrics

**`frontend/src/components/visualization/ProgressCharts.jsx`**
Analytics charts component:
- Goal progress over time
- Mood trends visualization
- Milestone completion tracking
- Category distribution
- Weekly activity patterns
- Responsive chart rendering

**`frontend/src/components/visualization/AnalyticsDashboard.jsx`**
Comprehensive analytics dashboard:
- Overall statistics (total cycles, goals, completion rates)
- Cycle-specific analytics
- Goal progress breakdown
- Mood trends
- Manifestation count
- Recent activity summary
- Progress rings for visual appeal
- API integration for real-time data
- Loading states and error handling

#### Configuration Files

**`frontend/package.json`**
Node.js project configuration:
- Dependencies: React, React Router, Axios, Tailwind CSS, Lucide icons
- Scripts: start, build, test, eject
- CRACO for custom webpack configuration
- Development dependencies for Tailwind and PostCSS

**`frontend/craco.config.js`**
CRACO configuration:
- Dev server proxy configuration (`/api` → `http://localhost:8001`)
- Webpack customizations
- Babel configurations

**`frontend/tailwind.config.js`**
Tailwind CSS configuration:
- Content paths for purging
- Theme customizations
- Color palette extensions
- Custom utilities

**`frontend/postcss.config.js`**
PostCSS configuration:
- Tailwind CSS integration
- Autoprefixer for browser compatibility

**`frontend/.env`**
Frontend environment variables:
```env
REACT_APP_BACKEND_URL=              # Not used (uses relative paths)
WDS_SOCKET_PORT=443                 # WebSocket port for hot reload
```

### Testing and Documentation

#### `test_result.md`
Comprehensive testing documentation:
- Testing protocol guidelines
- Backend task tracking with status history
- Frontend task tracking with status history
- Test sequence metadata
- Agent communication logs
- Bug fixes and resolutions
- Test credentials and scenarios

#### `memory/test_credentials.md`
Test user credentials for development and testing:
- Registered test users
- Email and password combinations
- Updated by testing agents
- Used for automated testing

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 16+
- MongoDB 5.0+
- Yarn package manager

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Run backend server
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
yarn install

# Run development server
yarn start
```

The frontend will be available at `http://localhost:3000` and will proxy API requests to `http://localhost:8001/api`.

## 🔐 Environment Variables

### Backend Required Variables
- `MONGO_URL` - MongoDB connection string (default: `mongodb://localhost:27017`)
- `DB_NAME` - Database name (default: `manifest12`)
- `SECRET_KEY` - JWT signing key (must be secure random string)
- `WDS_SOCKET_PORT` - WebSocket port (default: `443`)

### Frontend Optional Variables
- `REACT_APP_BACKEND_URL` - Not used in current implementation (uses relative paths)
- `WDS_SOCKET_PORT` - WebSocket port for dev server (default: `443`)

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  \"email\": \"user@example.com\",
  \"password\": \"securepass123\",
  \"full_name\": \"John Doe\"
}

Response: {
  \"access_token\": \"jwt_token_here\",
  \"user\": {
    \"id\": \"uuid\",
    \"email\": \"user@example.com\",
    \"full_name\": \"John Doe\",
    \"created_at\": \"2025-01-15T10:00:00\"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  \"email\": \"user@example.com\",
  \"password\": \"securepass123\"
}

Response: {
  \"access_token\": \"jwt_token_here\",
  \"user\": {...}
}
```

### Cycle Endpoints

#### Create Cycle
```http
POST /api/cycles
Authorization: Bearer {token}
Content-Type: application/json

{
  \"title\": \"Q1 2025 Transformation\",
  \"description\": \"Focus on health and career goals\",
  \"law_of_attraction_statement\": \"I am attracting abundance in all areas\",
  \"start_date\": \"2025-01-15T00:00:00Z\"
}
```

### Goal Endpoints

#### Create Goal
```http
POST /api/goals
Authorization: Bearer {token}
Content-Type: application/json

{
  \"cycle_id\": \"cycle_uuid\",
  \"title\": \"Achieve Financial Freedom\",
  \"description\": \"Save $10,000 and build passive income\",
  \"category\": \"Finance\",
  \"start_week\": 1,
  \"target_week\": 12,
  \"why_statement\": \"To create security and freedom for my family\",
  \"visualization_note\": \"I see myself checking my bank balance with joy\",
  \"milestones\": [
    {\"title\": \"Save $2,500\", \"target_week\": 3},
    {\"title\": \"Launch side hustle\", \"target_week\": 6},
    {\"title\": \"Reach $10,000\", \"target_week\": 12}
  ]
}
```

## 🧪 Testing

### Backend Testing
The application includes comprehensive backend testing covering:
- User registration and authentication
- Password validation (minimum 6 characters)
- JWT token generation and validation
- Database operations (CRUD)
- Email validation
- Duplicate email prevention
- Password hashing with bcrypt

### Frontend Testing
Frontend testing covers:
- Registration form validation
- Login flow
- Password reset flow
- Frontend-backend integration
- Error handling and display
- Protected route access

### Running Tests
Test results are documented in `/app/test_result.md` with complete test history and status.

## 🔒 Security Features

1. **Password Security**
   - Minimum 6 characters requirement
   - Bcrypt hashing with salt
   - No plaintext password storage

2. **Authentication**
   - JWT tokens with 7-day expiration
   - Secure token storage in localStorage
   - Authorization header for all protected routes

3. **Password Reset**
   - Secure token generation
   - 1-hour token expiration
   - One-time use tokens
   - Token validation before reset

4. **API Security**
   - CORS configuration
   - Input validation with Pydantic
   - Email format validation
   - User-specific data isolation

## 🎨 Design Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Clean, minimalist interface with Tailwind CSS
- **Visual Feedback** - Progress rings, charts, and status indicators
- **Intuitive Navigation** - Easy-to-use modal-based interactions
- **Accessibility** - Semantic HTML and ARIA labels

## 📈 Performance Optimizations

1. **Database Query Optimization**
   - Field projections to fetch only needed data
   - Query limits (max 100 records)
   - Indexed fields for fast lookups

2. **Frontend Optimization**
   - Code splitting with React Router
   - Lazy loading of components
   - Efficient state management with Context API
   - Debounced API calls

3. **Backend Optimization**
   - Async/await for non-blocking I/O
   - Connection pooling with Motor
   - Efficient data serialization with Pydantic

## 🚢 Deployment

### Deployment-Ready Checklist
✅ CORS configured for production  
✅ Environment variables externalized  
✅ Database queries optimized  
✅ Secrets secured in .env files  
✅ No hardcoded URLs or ports  
✅ All services running correctly  
✅ Supervisor configuration valid  

### Emergent Deployment
The application is ready for deployment on Emergent platform:
- FastAPI backend on port 8001 with `/api` prefix
- React frontend on port 3000
- MongoDB managed by Emergent
- Kubernetes ingress routing configured
- Health checks enabled

### Environment Setup for Production
1. Set `MONGO_URL` to production MongoDB instance
2. Set `DB_NAME` to production database name
3. Generate secure `SECRET_KEY` using `secrets.token_urlsafe(32)`
4. Update CORS settings if needed for specific domains

## 🤝 Contributing

This is a personal manifestation platform. For bugs or feature requests, please document in the issue tracker.

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- Built with FastAPI and React
- Inspired by Law of Attraction and Neville Goddard teachings
- Designed for personal transformation and goal achievement

## 📞 Support

For technical issues or questions about deployment, refer to the Emergent platform documentation.

---

**Built with ❤️ for manifestation and personal growth**

Version: 1.0.0  
Last Updated: January 2025
"

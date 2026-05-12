# Creatacourse.io - Project Documentation

## 1. Overview
**Creatacourse.io** is a gamified learning platform designed to let users create, manage, and consume structured courses. It transforms raw text content (like ChatGPT outputs) into interactive, phase-based learning experiences with progress tracking and gamification elements.

## 2. Technology Stack
- **Frontend**: React (Vite)
- **Styling**: Vanilla CSS (Variables-based design system)
- **Authentication**: Firebase Authentication (Email/Password)
- **Database**: Firebase Firestore (NoSQL)
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 3. Key Features

### 🔐 Authentication & Security
- **Sign Up/Login**: Secure email/password authentication.
- **Email Verification**: Automated verification emails sent via Firebase.
- **Protected Routes**: Users cannot access the dashboard or courses without logging in.
- **Data Isolation**: Users only see their own courses (except Admins).

### 🎮 Gamification
- **XP System**: Users earn XP for completing phases.
- **Leveling**: XP contributes to user levels.
- **Streaks**: Tracks daily activity (simulated).
- **Progress Tracking**: Visual progress bars for every course and phase.

### 📝 Course Creator
- **AI-Friendly Parser**: Paste structured text (e.g., "Phase 1: Title... Link...") and the app automatically parses it into a JSON course structure.
- **Custom Courses**: Users can create unlimited custom courses.

### 🛠️ Admin Dashboard
- **User Management**: View all registered users.
- **Course Management**: View and delete any course in the system.
- **Role-Based Access**: Only users with the `admin` role can access this dashboard.

### 🎨 UI & UX
- **Cinematic Intro**: "Netflix-style" intro animation with a custom logo.
- **Dark Mode**: Sleek, dark-themed UI with neon accents.
- **Responsive Design**: Works on desktop and mobile.

## 4. Project Structure
```
src/
├── components/        # Reusable UI components (IntroAnimation, etc.)
├── features/
│   ├── admin/         # AdminDashboard
│   ├── auth/          # LoginPage, SignupPage, AuthContext
│   ├── course/        # CourseView, CourseSidebar
│   ├── creator/       # CourseCreator (Parser logic)
│   ├── db/            # Firestore services (save/load/delete)
│   ├── gamification/  # GamificationContext, ProfilePage
│   └── home/          # HomePage (Dashboard)
├── lib/               # Firebase configuration
├── styles/            # Global CSS and Variables
└── App.jsx            # Main routing and layout logic
```

## 5. Setup & Installation

### Prerequisites
- Node.js installed.
- Firebase project set up (Authentication & Firestore enabled).

### Running Locally
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 6. Usage Guide

### Creating a Course
1.  Navigate to **Create Course** in the sidebar.
2.  Paste your course content in the text area.
3.  Ensure it follows the format: `Phase [N]: [Title]`.
4.  Click **Create Course**.

### Admin Access
1.  Set a user's role to `admin` in the Firestore Console (`users` collection).
2.  The user will now see the "Admin Dashboard" link in the sidebar.

## 7. Deployment
Currently, this project can be easily deployed via modern hosting platforms such as Vercel, Netlify, or Firebase Hosting.

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` from the project root and follow the prompts.
3. Make sure to add Firebase environment variables to your deployment configuration if using `.env` variables.

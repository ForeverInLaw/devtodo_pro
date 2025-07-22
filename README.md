# DevTodo Pro

A modern task management application built with React, Vite, Tailwind CSS, and Supabase. This project serves as a powerful, scalable, and easy-to-use to-do list application.

## 🚀 Features

- **Framework**: **React 18** for building dynamic user interfaces.
- **Build Tool**: **Vite** for a lightning-fast development experience.
- **Backend & Auth**: **Supabase** for database, authentication, and auto-generated APIs.
- **Styling**: **Tailwind CSS** for a utility-first CSS workflow, with `tailwind-merge` and `clsx` for class name management.
- **Routing**: **React Router v6** for declarative client-side routing.
- **State Management**: React Context API for efficient and predictable global state management.
- **Animations**: **Framer Motion** for creating smooth and beautiful UI animations.
- **UI Components**: A rich set of reusable components, including custom UI elements built with Radix UI primitives.
- **Real-time Collaboration**: Invite users to projects, manage roles, and see live updates.

## ✨ Changelog

### Version 0.1.0 (2025-07-13)

- **Feature: Real-time Collaboration**
  - Users can now create projects and invite other users to collaborate.
  - Implemented a role-based access control system with 'admin', 'editor', and 'viewer' roles.
  - The task dashboard now updates in real-time for all project members.
- **Database:**
  - Added `project_members` and `invitations` tables to manage collaboration.
  - Updated all RLS policies to support multi-user projects.
  - Added several RPC functions to handle project creation, invitations, and member management securely.
- **UI/UX:**
  - Added a new project management page to invite and manage members.
  - Updated the task dashboard and project selector to reflect the new data model.

## 📋 Prerequisites

- Node.js (v16.x or higher)
- npm, yarn, or pnpm

## 🛠️ Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/ForeverInLaw/devtodo_pro.git
cd devtodo_pro
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

1.  Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
2.  Open the `.env` file and add your Supabase project credentials. You can get these from your Supabase project's dashboard under `Settings` > `API`.

    ```env
    VITE_SUPABASE_URL=your-supabase-project-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

    These are the only required environment variables for this project.

### 4. Run the Development Server

Start the Vite development server:

```bash
npm run start
```

The application should now be running at `http://localhost:4028` (or another port if 4028 is in use).

## 📁 Project Structure

```
devtodo_pro/
├── public/               # Static assets (icons, images)
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts (e.g., AuthContext)
│   ├── lib/              # Libraries and helper configurations (e.g., Supabase client)
│   ├── pages/            # Page components for different routes
│   ├── styles/           # Global styles and Tailwind CSS entry points
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main application component
│   ├── Routes.jsx        # Application routing setup
│   └── index.jsx         # Application entry point
├── supabase/             # Supabase database migrations
├── .env.example          # Example environment variables
├── index.html            # Main HTML template for Vite
├── package.json          # Project dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── vite.config.mjs       # Vite configuration
```

## 📦 Deployment on Vercel

Deploying this application to Vercel is a straightforward process.

1.  **Push to a Git Repository**: Make sure your project is on GitHub, GitLab, or Bitbucket.

2.  **Create a Vercel Project**:

    - Log in to your Vercel account.
    - Click "Add New..." > "Project".
    - Import the Git repository for this project.

3.  **Configure the Project**:

    - Vercel will automatically detect that you are using **Vite** and set the build configurations.
    - **Build Command**: Should be `vite build` or `npm run build`.
    - **Output Directory**: Should be `build`.
    - **Install Command**: Should be `npm install`.

4.  **Add Environment Variables**:

    - In your Vercel project's settings, navigate to the **Environment Variables** section.
    - Add your Supabase credentials, making sure they match the ones in your `.env` file:
      - `VITE_SUPABASE_URL`
      - `VITE_SUPABASE_ANON_KEY`
    - Add any other API keys your production application requires.

5.  **Deploy**:
    - Click the "Deploy" button. Vercel will start the build process and deploy your application.
    - Once the deployment is complete, you will be provided with a public URL for your live site.

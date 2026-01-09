# User Analytics Dashboard

A modern, full-stack user analytics solution for tracking and visualizing user behavior on your website. Track page views, clicks, sessions, and visualize user interactions with interactive heatmaps.

## Features

- 📊 **Event Tracking** - Automatically track page views and user clicks
- 🔍 **Session Management** - Monitor and analyze user sessions
- 🗺️ **Heatmap Visualization** - Visualize user click patterns with interactive heatmaps
- 🚀 **Lightweight Tracker** - Simple JavaScript snippet for easy integration
- 📱 **Modern Dashboard** - Beautiful, responsive Next.js dashboard

## Tech Stack

### Backend
- **Hono** - Fast web framework
- **MongoDB** - Database for storing events and sessions
- **TypeScript** - Type-safe development
- **Node.js** - Runtime environment

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **TypeScript** - Type-safe development

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd user-analytics-Akanksha
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/user-analytics
   PORT=4000
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Start the development servers**

   In the `server` directory:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:4000`

   In the `frontend` directory (new terminal):
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

## Usage

### Integrating the Tracker

Add the tracker script to your website. The tracker is located at `server/src/tracker/tracker.js`. You can:

1. **Copy the tracker code** and include it in your HTML:
   ```html
   <script>
     // Paste tracker.js content here
   </script>
   ```

2. **Update the API URL** in the tracker if your backend is hosted elsewhere:
   ```javascript
   const API = 'http://your-backend-url/api/events';
   ```

The tracker automatically:
- Generates and stores a session ID
- Tracks page views
- Tracks click events with coordinates

### Dashboard

Once running, visit `http://localhost:3000` to access the dashboard where you can:
- View all user sessions
- Analyze individual session details
- Explore click heatmaps

## Project Structure

```
user-analytics-Akanksha/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js app directory
│   │   ├── sessions/ # Session viewing pages
│   │   └── heatmap/  # Heatmap visualization
│   └── ...
├── server/           # Backend API server
│   ├── src/
│   │   ├── routes/   # API route handlers
│   │   ├── db/       # Database connection
│   │   └── tracker/  # Analytics tracker script
│   └── ...
└── README.md
```

## API Endpoints

- `POST /api/events` - Submit analytics events
- `GET /api/sessions` - Retrieve user sessions
- `GET /api/heatmap` - Get heatmap data

## Development

- Backend dev server: `npm run dev` (in `server/` directory)
- Frontend dev server: `npm run dev` (in `frontend/` directory)

## License

ISC

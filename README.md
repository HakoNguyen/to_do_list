[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YHSq4TPZ)

# To-Do App – Preliminary Assignment Submission

⚠️ Please complete **all sections marked with the ✍️ icon** — these are required for your submission.

👀 Please Check ASSIGNMENT.md file in this repository for assignment requirements.

## 🚀 Project Setup & Usage

**How to install and run your project:**

### Frontend Setup

- Clone the repository: `git clone <repository-url>`
- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

### Backend Setup (Required for AI features)

- Navigate to backend directory: `cd backend`
- Install Python dependencies: `pip install -r requirements.txt`
- Start the backend server: `uvicorn main:app --reload --port 8000`
- Backend API will be available at: `http://localhost:8000`
- API documentation: `http://localhost:8000/docs`

### Full Stack Development

1. **Terminal 1** - Start Backend:

   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

2. **Terminal 2** - Start Frontend:

   ```bash
   npm install
   npm run dev
   ```

3. Open your browser and go to: `http://localhost:5173`

## 🔗 Deployed Web URL or APK file

✍️ [Paste your link here]

## 🎥 Demo Video

**Demo video link (≤ 2 minutes):**  
📌 **Video Upload Guideline:** when uploading your demo video to YouTube, please set the visibility to **Unlisted**.

- “Unlisted” videos can only be viewed by users who have the link.
- The video will not appear in search results or on your channel.
- Share the link in your README so mentors can access it.

✍️ https://youtu.be/H_07QU4Unvw

## 💻 Project Introduction

### a. Overview

This is an intelligent task management application designed specifically for Vietnamese university students. The app helps students organize their academic and personal tasks with AI-powered natural language processing, allowing them to create tasks through conversational input in Vietnamese. The application features three different views (List, Calendar, Analytics) and supports full CRUD operations with persistent local storage.

### b. Key Features & Function Manual

**Core Features:**

- **Task Management**: Create, read, update, and delete tasks with title, description, deadline, and priority levels
- **Task Detail View**: Click on any task to view detailed information in a modal card
- **AI Chat Widget**: Natural language task creation using Vietnamese language input (e.g., "Nhắc mình mai 8h họp team với anh Nam")
- **Three View Modes**:
  - **List View**: Paginated task list with click-to-view details, edit/delete/toggle completion functionality
  - **Calendar View**: Visual calendar representation of tasks and deadlines
  - **Analytics View**: Task completion statistics and productivity insights
- **Priority System**: Three-level priority classification (Low, Medium, High) with intelligent detection
- **Date Intelligence**: Smart date parsing for Vietnamese expressions (mai, tuần tới, cuối tuần, etc.)
- **Local Storage**: Persistent data storage using browser's localStorage API
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

**How to Use:**

1. **Creating Tasks**: Use the form at the top or click the chat widget to create tasks via natural language
2. **Viewing Task Details**: Click on any task in the list to view detailed information including description, deadline, priority, and completion status
3. **Managing Tasks**: In the task detail modal, click "Chỉnh sửa" to edit, "Xóa" to delete, or toggle completion status
4. **Quick Actions**: Use the "Sửa" and "Xóa" buttons in the task list for quick actions
5. **Viewing Tasks**: Switch between List, Calendar, and Analytics views using the navigation buttons
6. **AI Assistant**: Click the chat icon to open the AI assistant for natural language task creation

### c. Unique Features (What's special about this app?)

- **Vietnamese Language AI Processing**: Advanced natural language understanding for Vietnamese expressions and date/time references
- **Intelligent Priority Detection**: AI automatically determines task priority based on keywords and context
- **Smart Date Parsing**: Converts Vietnamese date expressions (mai, tuần tới, 2 ngày nữa) to precise ISO timestamps
- **Interactive Task Details**: Click-to-view detailed task information with comprehensive task management options
- **Multi-View Data Representation**: Same task data presented in three different perspectives for better user experience
- **Real-time AI Integration**: Backend AI service processes natural language input and generates structured task data
- **Pagination Support**: Handles 20+ tasks efficiently with pagination and performance optimization

### d. Technology Stack and Implementation Methods

**Frontend:**

- **React 19.1.1**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with comprehensive type definitions
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Custom Hooks**: useLocalStorage for persistent state management

**Backend:**

- **Python FastAPI**: RESTful API server for AI processing
- **Mistral AI**: Large language model for natural language understanding
- **Custom AI Prompts**: Vietnamese-optimized system prompts for task extraction
- **Date Processing**: Advanced Vietnamese date parsing algorithms

**Architecture:**

- **Client-Side Storage**: localStorage for data persistence
- **AI Service Integration**: RESTful API calls to backend AI service
- **Component-Based Design**: Modular React components for maintainability
- **Type-Safe Interfaces**: Comprehensive TypeScript interfaces for data models

### e. Service Architecture & Database structure (when used)

**Frontend Architecture:**

```
src/
├── components/          # Reusable UI components
│   ├── TaskForm.tsx    # Task creation/editing form
│   ├── TaskList.tsx    # Paginated task display with click-to-view
│   ├── TaskDetailCard.tsx # Task detail modal component
│   ├── TaskCalendar.tsx # Calendar view component
│   ├── TaskAnalytics.tsx # Analytics component
│   └── ChatWidget.tsx  # AI chat interface
├── views/              # Main application views
│   ├── HomeView.tsx    # Task list view
│   ├── CalendarView.tsx # Calendar view
│   └── AnalyticsView.tsx # Analytics view
├── services/           # Data and API services
│   ├── taskLocal.ts    # localStorage operations
│   └── aiClient.ts     # AI service integration
└── models/             # TypeScript interfaces
    └── task.ts         # Task data model
```

**Backend Architecture:**

```
backend/
├── ai/
│   ├── service.py      # AI processing logic
│   ├── prompts.py      # Vietnamese system prompts
│   └── client.py       # Mistral AI client
├── models/
│   └── schemas.py      # Pydantic data models
└── routers/
    └── chat.py         # API endpoints
```

**Data Structure:**

```typescript
interface Task {
  id: string; // Unique identifier
  title: string; // Task title
  description: string; // Task description
  deadline: string; // ISO date string
  priority: "low" | "medium" | "high"; // Priority level
  isCompleted: boolean; // Completion status
}
```

**Storage Method:**

- **Local Storage**: Browser's localStorage API for data persistence
- **JSON Serialization**: Tasks stored as JSON strings in localStorage
- **Real-time Sync**: Automatic data synchronization across views

## 🧠 Reflection

### a. If you had more time, what would you expand?

✍️ [Write your content here]

### b. If you integrate AI APIs more for your app, what would you do?

✍️ [Write your content here]

## ✅ Checklist

- [ ] Code runs without errors
- [ ] All required features implemented (add/edit/delete/complete tasks)
- [ ] All ✍️ sections are filled

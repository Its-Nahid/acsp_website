# 📂 Projects Module - Proposed Folder Structure

This document provides a detailed breakdown of the file system changes required to implement the Projects module.

## Workspace Overview

```text
acsp_website-1/
├── AI_Plan/
│   ├── implementation_plan.md      # Strategic overview and tech specs
│   └── folder_structure.md         # [CURRENT FILE] Detailed file map
│
├── Backend/
│   ├── controllers/
│   │   └── projectController.js    # Logic for handling project-related requests
│   ├── models/
│   │   └── Project.js              # Mongoose schema for project data
│   ├── routes/
│   │   └── projectRoutes.js        # API route definitions
│   └── server.js                   # [UPDATE] To include projectRoutes
│
├── Frontend/
│   ├── projects.html               # Main page listing all initiatives
│   ├── project-details.html        # Dynamic page for individual project info
│   ├── css/
│   │   └── projects.css            # Styles for project cards and progress bars
│   ├── js/
│   │   └── projects.js             # API fetching and DOM manipulation logic
│   └── components.js               # [UPDATE] To include project links in navigation
│
└── uploads/
    └── projects/                   # Storage for project-specific media
```

## Detailed File Descriptions

### Backend
1. **`models/Project.js`**: Defines the data structure (Title, Goal, Status, AI-Summary).
2. **`routes/projectRoutes.js`**: Handles endpoints like `GET /api/projects` and `POST /api/projects`.
3. **`controllers/projectController.js`**: Contains the logic for calculating funding percentages and interfacing with the Gemini AI for summary generation.

### Frontend
1. **`projects.html`**: Uses a grid layout (Tailwind CSS) to show project cards with real-time progress bars.
2. **`project-details.html`**: A rich media page showing the project's journey, milestones, and a direct "Donate Now" button linked to the project's funding goal.
3. **`js/projects.js`**: Manages the lifecycle of the projects page, including loading states and dynamic filtering.

---
*Created by Antigravity AI - 2026-04-26*

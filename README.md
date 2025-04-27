# Mini-CRM Frontend

![Mini-CRM](https://img.shields.io/badge/Mini--CRM-Frontend-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF)

A modern, responsive Customer Relationship Management (CRM) application built with React, TypeScript, and Tailwind CSS. This frontend application connects to a Node.js/Express backend with PostgreSQL database.

## Features

- **Authentication System**: Secure login and registration with JWT
- **Dashboard**: Overview of key metrics and recent activities
- **Client Management**: Add, edit, view, and delete client information
- **Project Management**: Track projects with status updates and budget tracking
- **Interactions**: Log and manage all client interactions
- **Reminders**: Set and manage reminders for follow-ups
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Fully responsive layout for all device sizes

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API with useImmerReducer
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **API Communication**: Axios
- **Notifications**: SweetAlert2
- **Icons**: React Icons (Feather Icons)

## Project Structure

```
src/
├── assets/           # Static assets like images
├── components/       # Reusable UI components
│   ├── common/       # Shared components (buttons, forms, etc.)
│   ├── clients/      # Client-related components
│   ├── projects/     # Project-related components
│   ├── interactions/ # Interaction-related components
│   ├── reminders/    # Reminder-related components
│   └── layout/       # Layout components (Sidebar, Navbar, etc.)
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── routes/           # Routing configuration
├── services/         # API service functions
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── App.tsx           # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see [CRM Backend Repository](https://github.com/mdalaminfaraji/crm-be))

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/mdalaminfaraji/crm-fe.git
   cd crm-fe
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## Key Features Implementation

### Authentication

The application uses JWT-based authentication with token refresh capabilities. Authentication state is managed through React Context and persisted in localStorage.

### Dashboard

The dashboard provides a quick overview of key metrics including:
- Total clients and projects
- Projects by status (visual representation)
- Upcoming reminders
- Recent interactions

### Client Management

Comprehensive client management with search, filtering, and pagination capabilities. Client details include contact information, associated projects, and interaction history.

### Project Management

Track projects with details such as:
- Project status (Not Started, In Progress, On Hold, Completed, Cancelled)
- Budget and actual costs
- Start and end dates
- Associated client

### Interactions

Log all client interactions with:
- Interaction type (Call, Email, Meeting, etc.)
- Date and time
- Notes
- Associated client and/or project

### Reminders

Set reminders for follow-ups with:
- Due date and time
- Priority level
- Description
- Associated client and/or project

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.


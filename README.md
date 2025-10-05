# Sales Agent Frontend

A modern React + TypeScript frontend for the Agentic Sales System, built with Vite, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Dashboard** - Monitor agent status and system health
- **Lead Search** - Search for business leads by location and type
- **SDR Workflow** - Execute complete sales development workflows
- **Email Management** - Send professional outreach emails
- **Agent Status** - View real-time status of all AI agents

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

## 📋 Prerequisites

- Node.js 20.19.0+ or 22.12.0+
- npm or yarn
- Backend API running on `http://localhost:8000`

## 🔧 Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from example:
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL (default: `http://localhost:8000`)

## 🏃 Running the App

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (Button, Card, etc.)
│   ├── layout/         # Layout components (Navbar, Layout)
│   └── features/       # Feature-specific components
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── LeadSearch.tsx
│   ├── SDRWorkflow.tsx
│   ├── EmailManagement.tsx
│   └── AgentStatus.tsx
├── services/           # API service layer
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── lib/                # Library configurations
│   └── utils.ts
├── App.tsx             # Main app component with routing
└── main.tsx            # App entry point
```

## 🎨 Pages

### Dashboard (`/`)
- Overview of all agents and their status
- System configuration status
- Quick action links

### Lead Search (`/leads`)
- Search for business leads by location
- Filter by business type, radius, and limit
- View detailed lead information with contact details

### SDR Workflow (`/workflow`)
- Execute complete sales workflow
- Steps: Research → Proposal → Call → Email
- View results for each workflow stage

### Email Management (`/email`)
- Send emails to leads
- Email templates for quick start
- Support for HTML emails

### Agent Status (`/status`)
- Monitor all AI agents
- View environment configuration
- System information and health checks

## 🔌 API Integration

The frontend connects to the backend API through the `apiService` in `src/services/api.ts`.

Available endpoints:
- `GET /health` - Health check
- `POST /api/v1/leads/search` - Search leads
- `POST /api/v1/email/send` - Send email
- `POST /api/v1/workflow/execute` - Execute SDR workflow
- `GET /api/v1/agents/status` - Get agent status

## 🎨 Customization

### Tailwind Configuration

Customize colors, spacing, and other design tokens in `tailwind.config.js`.

### API URL

Set your backend API URL in `.env`:
```env
VITE_API_URL=http://localhost:8000
```

## 🧩 Components

The project uses custom UI components inspired by shadcn/ui:

- `Button` - Various button styles and sizes
- `Card` - Card container with header, content, footer
- `Input` - Form input fields
- `Badge` - Status badges
- `Layout` - Main layout wrapper
- `Navbar` - Navigation bar

## 📝 Environment Variables

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:8000`)

## 🚦 Development

### Adding a New Page

1. Create page component in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/layout/Navbar.tsx`

### Adding API Endpoints

1. Add types in `src/types/index.ts`
2. Add service method in `src/services/api.ts`
3. Use in your page component

## 🐛 Troubleshooting

### API Connection Issues

- Ensure backend server is running on `http://localhost:8000`
- Check CORS settings in backend
- Verify `.env` file has correct `VITE_API_URL`

### Build Issues

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Update Node.js to version 20.19.0 or higher

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

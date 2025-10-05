# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend API
In a separate terminal, navigate to the backend and start the server:
```bash
cd ../
python start_server.py
```

The backend API will be available at `http://localhost:8000`

### 3. Start Frontend
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📱 Available Pages

Once running, visit:

- **Dashboard** - `http://localhost:5173/` - System overview
- **Lead Search** - `http://localhost:5173/leads` - Find business leads
- **SDR Workflow** - `http://localhost:5173/workflow` - Run complete workflow
- **Email** - `http://localhost:5173/email` - Send emails
- **Agent Status** - `http://localhost:5173/status` - Monitor agents

## 🎯 Try It Out

### Search for Leads
1. Go to **Lead Search** page
2. Enter location (e.g., "New York")
3. Optionally add business type (e.g., "restaurants")
4. Click "Search Leads"

### Run SDR Workflow
1. Go to **SDR Workflow** page
2. Fill in business information
3. Click "Start Workflow"
4. Wait for all steps to complete (Research → Proposal → Call → Email)

### Send an Email
1. Go to **Email** page
2. Enter recipient email, subject, and body
3. Click "Send Email"

### Monitor System
1. Go to **Agent Status** page
2. View all agents and their status
3. Check environment configuration

## 🛠️ Troubleshooting

### Backend Not Running
If you see "API Connection Failed" errors:
1. Make sure backend is running on port 8000
2. Check `.env` file has `VITE_API_URL=http://localhost:8000`

### CORS Errors
The backend has CORS enabled for all origins in development. If you still see CORS errors, restart both servers.

### Port Already in Use
If port 5173 is taken:
```bash
npm run dev -- --port 3000
```

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the codebase in `src/` directory
- Check backend API docs at `http://localhost:8000/docs`

## 🎨 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components (Dashboard, LeadSearch, etc.)
├── services/       # API integration layer
├── types/          # TypeScript type definitions
└── lib/            # Utility functions
```

Happy building! 🎉

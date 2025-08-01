# 🚀 Smart Task Manager - Quick Start Guide

## Getting Started

### Option 1: Node.js Server (Recommended for Voice Features)
```bash
# Run the Node.js server
.\run-node-server.bat
```
Then open: **http://localhost:8000**

### Option 2: Direct File Opening (Limited Voice Support)
```bash
# Open directly in browser
.\run-frontend.bat
```

### Option 3: Test Voice Recognition First
1. Open `frontend/voice-simple.html` in your browser
2. Test if voice recognition works on your system
3. If it works, use the main application

## Voice Recognition Setup

### Prerequisites:
- **Node.js** installed (download from https://nodejs.org/)
- **Modern browser** (Chrome, Edge, Safari recommended)
- **Microphone** enabled and working

### Troubleshooting Voice Recognition:

1. **If you get "Voice recognition failed" error:**
   - Use the Node.js server: `.\run-node-server.bat`
   - Open `http://localhost:8000` instead of the file directly

2. **If microphone access is denied:**
   - Click the microphone icon in your browser's address bar
   - Select "Allow" for microphone access

3. **If voice recognition doesn't work:**
   - Try a different browser (Chrome works best)
   - Check if your microphone works in other applications
   - Make sure you're speaking clearly

## Available Voice Commands

- **"Add task [title] [description]"** - Create new task
- **"Edit task [old title] to [new title]"** - Edit existing task
- **"Delete task [title]"** - Delete task
- **"Complete task [title]"** - Mark task as complete
- **"Show all tasks"** - Display all tasks
- **"Show completed tasks"** - Display completed tasks
- **"Show pending tasks"** - Display pending tasks

## Features

✅ **Task Management** - Create, edit, delete tasks
✅ **Voice Commands** - Hands-free operation
✅ **Categories** - Organize tasks by category
✅ **Local Storage** - Data persists between sessions
✅ **Responsive Design** - Works on mobile and desktop
✅ **Offline Support** - No internet required

## File Structure

```
Smart Task Manager/
├── frontend/
│   ├── index.html          # Main application
│   ├── voice-simple.html   # Voice test page
│   ├── voice-test.html     # Detailed voice test
│   ├── css/style.css       # Styles
│   └── js/app.js          # Application logic
├── server.js              # Node.js server
├── package.json           # Node.js configuration
├── run-node-server.bat    # Windows server script
├── run-node-server.ps1    # PowerShell server script
└── README.md             # Detailed documentation
```

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Try the voice test page first
3. Use the Node.js server for best compatibility
4. Ensure microphone permissions are granted

## Browser Compatibility

- **Chrome** - Full voice support ✅
- **Edge** - Good voice support ✅
- **Safari** - Limited voice support ⚠️
- **Firefox** - Limited voice support ⚠️ 
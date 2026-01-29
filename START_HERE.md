# MERN File Handler - Manual Start Instructions

## Prerequisites Check

Before starting, ensure you have:

1. ✅ **Node.js installed** (v18 or higher)
   - Check: `node --version`
   - Download: https://nodejs.org/

2. ⚠️ **MongoDB installed and running**
   - Check: Open Task Manager and look for "mongod" process
   - Or run: `mongo` or `mongosh` in terminal
   - Download: https://www.mongodb.com/try/download/community
   - Start: Run `mongod` in a terminal or start MongoDB service

## Installation Steps

### Step 1: Install Backend Dependencies

```powershell
cd c:\Users\attij\newproject\project2\server
npm install
```

Expected output: "added 143 packages" (already done ✅)

### Step 2: Install Frontend Dependencies

```powershell
cd c:\Users\attij\newproject\project2\client
npm install
```

⚠️ If you encounter network errors:

- Check internet connection
- Try: `npm config set registry https://registry.npmjs.org/`
- Or try with different network
- Or use a VPN if behind a firewall

Expected packages to install:

- react, react-dom
- react-router-dom
- axios
- socket.io-client
- react-icons
- vite
- @vitejs/plugin-react

## Running the Application

### Terminal 1 - Start Backend:

```powershell
cd c:\Users\attij\newproject\project2\server
npm run dev
```

You should see:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Server running on port 5000
📊 Environment: development
🌐 API: http://localhost:5000/api
🔌 Socket.io: Ready for connections
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ MongoDB connected successfully
```

### Terminal 2 - Start Frontend:

```powershell
cd c:\Users\attij\newproject\project2\client
npm run dev
```

You should see:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Open Browser

Open http://localhost:5173 in your browser

## First Time Usage

1. **Register**: Create a new account
   - Username: yourusername
   - Email: your@email.com
   - Password: yourpassword (min 6 chars)

2. **Login**: Sign in with your credentials

3. **Upload Files**:
   - Drag & drop a file or click to browse
   - Add optional description
   - Choose public/private
   - Click "Upload File"

4. **Manage Files**:
   - Preview: Click on image/video/audio files
   - Download: Click download button
   - Edit: Click preview, then "Edit Details"
   - Delete: Click delete button (with confirmation)
   - Filter: Use "All Files", "My Files", or "Public Files"

## Testing Real-time Updates

1. Open http://localhost:5173 in two browser windows
2. Login to both (can use same or different accounts)
3. Upload a file in one window
4. Watch it appear instantly in the other window!

## Troubleshooting

### Problem: MongoDB Connection Error

**Solution:**

- Ensure MongoDB is installed
- Start MongoDB: Open terminal and run `mongod`
- Or start MongoDB Windows Service:
  - Open Services (services.msc)
  - Find "MongoDB Server"
  - Click "Start"

### Problem: Port 5000 Already in Use

**Solution:**

- Change PORT in `server/.env` to another port (e.g., 5001)
- Update `client/vite.config.js` proxy target to match

### Problem: Port 5173 Already in Use

**Solution:**

- Vite will automatically try next available port
- Or change in `client/vite.config.js`

### Problem: npm install fails in client folder

**Solution:**

- Check internet connection
- Clear npm cache: `npm cache clean --force`
- Try different network or use mobile hotspot
- Use npm registry directly: `npm config set registry https://registry.npmjs.org/`

### Problem: Files not uploading

**Solution:**

- Check if `server/uploads` directory exists (created automatically)
- Verify file size is under 100MB
- Check browser console for errors

### Problem: Real-time updates not working

**Solution:**

- Ensure Socket.io is connected (check browser console)
- Verify backend Socket.io is running (check server logs)
- Check CORS settings allow Socket.io connections

## Environment Variables

### Server (.env) - Already configured ✅

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-files
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

### Client (.env) - Already configured ✅

```
VITE_API_URL=http://localhost:5000/api
```

## Quick Reference

### Backend is running when you see:

- "Server running on port 5000"
- "MongoDB connected successfully"
- No error messages

### Frontend is running when you see:

- "VITE v5.x.x ready"
- "Local: http://localhost:5173/"

### MongoDB is running when:

- You see "mongod" process in Task Manager
- You can connect via `mongo` or `mongosh` command
- Server shows "MongoDB connected successfully"

## Need Help?

1. Check server terminal for error messages
2. Check browser console (F12) for client errors
3. Verify all prerequisites are met
4. Ensure .env files have correct values
5. Check that all npm installs completed successfully

## Quick Command Reference

```powershell
# Check if MongoDB is running
Get-Process mongod

# Start MongoDB (if installed but not running)
mongod

# Check Node.js version
node --version

# Check npm version
npm --version

# Clear npm cache (if install fails)
npm cache clean --force

# Restart servers
# Press Ctrl+C in each terminal, then run npm run dev again
```

---

**Current Status:**

- ✅ Backend: Ready to run (`npm run dev` in server folder)
- ⚠️ Frontend: Dependencies need installation when network is available
- ⚠️ MongoDB: Needs to be installed and started

**Next Steps:**

1. Ensure MongoDB is installed and running
2. Install frontend dependencies: `cd client && npm install`
3. Start backend: `cd server && npm run dev`
4. Start frontend: `cd client && npm run dev`
5. Open browser: http://localhost:5173

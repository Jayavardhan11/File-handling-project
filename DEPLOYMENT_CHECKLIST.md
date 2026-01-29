# ✅ DEPLOYMENT CHECKLIST

## Pre-Deployment Setup (Do These First)

### Step 1: Prepare Environment Variables

- [ ] Create `.env` file in `server/` folder
- [ ] Add `MONGODB_URI` (from MongoDB Atlas)
- [ ] Add `JWT_SECRET` (generate a random key)
- [ ] Add `COMPANY_EMAIL_DOMAIN=techcorp.com`
- [ ] Add `COMPANY_NAME=TechCorp`
- [ ] Add `HUGGINGFACE_API_KEY` (from HuggingFace.co)
- [ ] Add `NODE_ENV=production`
- [ ] Add `PORT=5000`

Reference: Use [.env.example](.env.example) as template

### Step 2: Test Locally

- [ ] Run `npm install` in server folder
- [ ] Run `npm install` in client folder
- [ ] Start backend: `npm start` from server folder
- [ ] Start frontend: `npm run dev` from client folder
- [ ] Register with test@techcorp.com
- [ ] Upload test files
- [ ] Test file preview (image, video, audio, PDF)
- [ ] Test chatbot (click chat button)
- [ ] Test file operations (edit, delete, download)

### Step 3: Prepare GitHub

- [ ] Make sure git is initialized: `git init`
- [ ] Add all files: `git add .`
- [ ] Commit: `git commit -m "v2.0 ready for production"`
- [ ] Create GitHub repository
- [ ] Add remote: `git remote add origin https://github.com/YOUR/REPO`
- [ ] Push to main: `git push -u origin main`
- [ ] Verify files are on GitHub

---

## Deployment to Render.com (15-20 minutes)

### Step 4: Create Render Account

- [ ] Go to https://render.com
- [ ] Sign up with GitHub account
- [ ] Authorize Render access to your repositories

### Step 5: Deploy Backend Service

- [ ] Click "New +" → "Web Service"
- [ ] Select your GitHub repository
- [ ] Configure:
  - [ ] Name: `techcorp-files-backend`
  - [ ] Environment: `Node`
  - [ ] Region: `Singapore` (or nearest)
  - [ ] Branch: `main`
  - [ ] Root Directory: `server`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Instance Type: `Free`

- [ ] Click "Advanced" and add Environment Variables:
  - [ ] `MONGODB_URI` = your MongoDB connection string
  - [ ] `JWT_SECRET` = your secret key
  - [ ] `COMPANY_EMAIL_DOMAIN` = `techcorp.com`
  - [ ] `COMPANY_NAME` = `TechCorp`
  - [ ] `HUGGINGFACE_API_KEY` = your HuggingFace API key
  - [ ] `NODE_ENV` = `production`
  - [ ] `PORT` = `5000`
  - [ ] `CLIENT_URL` = (leave blank for now, update later)

- [ ] Click "Create Web Service"
- [ ] Wait 5-10 minutes for deployment
- [ ] ⚠️ Copy backend URL: `https://your-backend-name.onrender.com`

### Step 6: Deploy Frontend Service

- [ ] Click "New +" → "Static Site"
- [ ] Select same GitHub repository
- [ ] Configure:
  - [ ] Name: `techcorp-files-frontend`
  - [ ] Branch: `main`
  - [ ] Root Directory: `client`
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Publish Directory: `dist`

- [ ] Add Environment Variables:
  - [ ] `VITE_API_URL` = `https://your-backend-name.onrender.com/api`
  - [ ] `VITE_SOCKET_URL` = `https://your-backend-name.onrender.com`

- [ ] Click "Create Static Site"
- [ ] Wait 3-5 minutes for deployment
- [ ] ⚠️ Copy frontend URL: `https://your-frontend-name.onrender.com`

### Step 7: Update Backend Configuration

- [ ] Go back to Backend service on Render
- [ ] Click "Environment"
- [ ] Update `CLIENT_URL` = `https://your-frontend-name.onrender.com`
- [ ] Click "Save Changes" (will auto-redeploy)
- [ ] Wait 2-3 minutes for backend to restart

---

## Post-Deployment Testing

### Step 8: Verify Deployment

- [ ] Open frontend URL in browser: `https://your-frontend-name.onrender.com`
- [ ] Page loads without errors
- [ ] Can see login/register forms

### Step 9: Test Company Authentication

- [ ] Click "Register"
- [ ] Try registering with non-company email (e.g., test@gmail.com)
- [ ] Should show error: "Only company email addresses (@techcorp.com) are allowed"
- [ ] Register with `test@techcorp.com`
- [ ] Should succeed
- [ ] Should be logged in automatically
- [ ] Should see dashboard

### Step 10: Test File Preview

- [ ] Click "File Upload"
- [ ] Upload an image file
- [ ] Should appear in file list
- [ ] Click the file
- [ ] Should show image preview
- [ ] Upload a PDF file
- [ ] Should show PDF preview with page navigation
- [ ] Upload a video file
- [ ] Should show video player
- [ ] Upload a text file
- [ ] Should show "Preview not available for this file type"

### Step 11: Test Chatbot

- [ ] Look for chat button (bottom-right corner)
- [ ] Click chat button
- [ ] Chat window should open
- [ ] Type: "How do I upload files?"
- [ ] Should get instant answer from knowledge base
- [ ] Ask: "What's your favorite color?"
- [ ] Should get AI response (slower, 2-5 seconds)

### Step 12: Test File Operations

- [ ] Upload a file
- [ ] Click file to edit
- [ ] Change description
- [ ] Toggle public/private
- [ ] Save changes
- [ ] Changes should be reflected
- [ ] Download the file
- [ ] File should download with correct filename
- [ ] Delete a file
- [ ] File should be removed from list

### Step 13: Test Real-Time Updates (Optional)

- [ ] Open frontend in 2 browser windows
- [ ] Upload file in window 1
- [ ] Should appear instantly in window 2
- [ ] Delete file in window 1
- [ ] Should disappear instantly from window 2

---

## Troubleshooting Checklist

### If Backend Won't Start

- [ ] Check MongoDB URI is correct
- [ ] Check MongoDB allows Render's IP
- [ ] Check all environment variables are set
- [ ] View Render logs for error messages
- [ ] Verify database exists in MongoDB

### If Frontend Can't Connect

- [ ] Check `VITE_API_URL` has correct backend URL
- [ ] Check backend service shows "live" status
- [ ] Wait 30-60 seconds (free tier takes time to wake up)
- [ ] Check browser console (F12) for errors
- [ ] Verify `CLIENT_URL` is set in backend

### If Chatbot Not Responding

- [ ] Check `HUGGINGFACE_API_KEY` is set
- [ ] Check HuggingFace API has available quota
- [ ] Check server logs for errors
- [ ] Try asking a different question
- [ ] Make sure backend is running

### If Email Validation Fails

- [ ] Check `COMPANY_EMAIL_DOMAIN` is set to `techcorp.com`
- [ ] Check email pattern in `client/src/pages/Register.jsx`
- [ ] Make sure you're using @techcorp.com email
- [ ] Check browser console for error details

### If File Upload Fails

- [ ] Check file size (may be too large)
- [ ] Check MongoDB has storage space
- [ ] Check server logs for errors
- [ ] Try a smaller file
- [ ] Wait for free tier to wake up if slow

### If Real-Time Updates Don't Work

- [ ] Check `VITE_SOCKET_URL` is correct
- [ ] Check browser console (F12) for Socket.io errors
- [ ] Refresh the page and try again
- [ ] Check both services are running

---

## Final Verification

### Before Sharing with Team

- [ ] ✅ Backend is live (green indicator on Render)
- [ ] ✅ Frontend is live and accessible
- [ ] ✅ Registration with @techcorp.com works
- [ ] ✅ Non-company email is rejected
- [ ] ✅ File operations work (upload, preview, delete)
- [ ] ✅ Chatbot responds to questions
- [ ] ✅ Real-time updates work (if tested)
- [ ] ✅ All environment variables are set

---

## Success Checklist

Your deployment is successful if ALL these are checked:

### Functionality

- [ ] Users can register with @techcorp.com email
- [ ] Users are rejected with non-company email
- [ ] Users can login
- [ ] Users can upload files
- [ ] File preview works for images, videos, audio, PDFs
- [ ] File preview shows "not available" for other types
- [ ] Users can edit file settings
- [ ] Users can delete files
- [ ] Users can download files
- [ ] Chatbot responds to questions
- [ ] Real-time updates work across browsers

### Security

- [ ] Only @techcorp.com emails allowed
- [ ] JWT tokens are working
- [ ] Files are properly secured
- [ ] API endpoints require authentication

### Performance

- [ ] Frontend loads in under 3 seconds
- [ ] Backend responds quickly (< 1 second)
- [ ] File operations are smooth
- [ ] Chatbot responds (KB < 1 second, AI 2-5 seconds)

---

## URLs to Save

After successful deployment, save these URLs:

```
Frontend: https://your-frontend-name.onrender.com
Backend:  https://your-backend-name.onrender.com/api
```

Share the **Frontend URL** with your team.

---

## Estimated Timelines

| Task                   | Time           |
| ---------------------- | -------------- |
| Environment setup      | 5 min          |
| Local testing          | 10 min         |
| GitHub push            | 2 min          |
| Backend deployment     | 10 min         |
| Frontend deployment    | 5 min          |
| URL configuration      | 3 min          |
| Testing & verification | 10 min         |
| **Total**              | **45 minutes** |

Note: Free tier may take longer due to cold starts.

---

## 🎉 Deployment Complete!

If all checkboxes are ticked, your project is successfully deployed and ready for use!

**Share your frontend URL with the team and they can start using it immediately.**

---

## 📞 Still Having Issues?

Check these files in order:

1. [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Detailed deployment help
2. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - How features work
3. [README_UPDATED.md](README_UPDATED.md) - Full documentation

---

**Version:** 2.0.0
**Deployment Guide:** ✅ Complete
**Status:** Ready for Production

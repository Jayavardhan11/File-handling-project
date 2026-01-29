# 🚀 Deployment Guide - TechCorp File Management System

> Updated with company-only features, enhanced chatbot, and improved file preview system

## Prerequisites

Before deployment, ensure you have:

- A GitHub account with your repository pushed
- A Render.com account (free)
- MongoDB connection string
- HuggingFace API key (for chatbot)

---

## Environment Variables Setup

Before deploying, create a `.env` file in the `server` directory:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Company Configuration
COMPANY_NAME=TechCorp
COMPANY_EMAIL_DOMAIN=techcorp.com

# HuggingFace API (for chatbot)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Client Configuration
CLIENT_URL=https://your-frontend-url.onrender.com
```

---

## Step 1: Push Code to GitHub

```bash
cd c:\Users\attij\newproject\project2

git init
git add .
git commit -m "Deploy TechCorp File Management System with company-only access and enhanced chatbot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/techcorp-files.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Render.com

### Create Backend Service:

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Select your GitHub repository
4. Configure:
   ```
   Name: techcorp-files-backend
   Environment: Node
   Region: Singapore (or closest to you)
   Branch: main
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

### Add Environment Variables:

Click **"Advanced"** and add these variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key
COMPANY_EMAIL_DOMAIN=techcorp.com
COMPANY_NAME=TechCorp
HUGGINGFACE_API_KEY=your_huggingface_api_key
CLIENT_URL=https://your-frontend-url.onrender.com
NODE_ENV=production
PORT=5000
```

5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. **Copy Backend URL:** `https://your-backend-name.onrender.com`

---

## Step 3: Deploy Frontend to Render.com

### Create Static Site:

1. Click **"New +"** → **"Static Site"**
2. Select same GitHub repository
3. Configure:
   ```
   Name: techcorp-files-frontend
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

### Add Environment Variables:

```
VITE_API_URL=https://your-backend-name.onrender.com/api
VITE_SOCKET_URL=https://your-backend-name.onrender.com
```

4. Click **"Create Static Site"**
5. Wait for deployment (3-5 minutes)
6. **Copy Frontend URL:** `https://your-frontend-name.onrender.com`

---

## Step 4: Update Backend Configuration

Go back to your Backend service on Render:

1. Click **"Environment"** tab
2. Update `CLIENT_URL` with your actual frontend URL
3. Click **"Save Changes"** (auto-redeploys)

---

## Step 5: Verify Deployment

### Test the Application:

1. **Visit Frontend:** `https://your-frontend-name.onrender.com`

2. **Test Company Email Validation:**
   - Try registering with non-company email → Should be rejected
   - Register with `yourname@techcorp.com` → Should succeed

3. **Test File Preview:**
   - Upload an image → Preview should work
   - Upload a PDF → Preview should work
   - Upload a text file → Preview should show "not available"

4. **Test Chatbot:**
   - Click the chat button (bottom-right)
   - Ask: "How do I upload files?" → Should get instant help
   - Ask a general question → Should use AI to respond

5. **Test File Management:**
   - Upload a file
   - Edit description and privacy settings
   - Test public/private toggle
   - Download file

---

## New Features Deployed

### 🔐 Company-Only Access

- Only `@techcorp.com` email addresses can register
- Employees can add department and job title
- Auto-approval for registered employees

### 👁️ Enhanced File Preview

- **Supported formats:** Images, Videos, Audio, PDFs
- **Removed:** Text, Code, JSON, CSV preview (to focus on core formats)
- Faster loading and better performance

### 🤖 Improved Chatbot

- **Knowledge Base:** Instant answers to common questions
- **AI Fallback:** Uses HuggingFace API for general questions
- **Quick Questions:** Buttons for popular topics
- **Company Context:** Aware of company-only features

### 📝 Updated Registration

- Email validation for company domain
- Department and job title fields
- Clear messaging about company-only access

---

## Troubleshooting

### Backend Issues

**"MongoDB connection failed"**

- Check MONGODB_URI is correct
- Verify IP is whitelisted in MongoDB Atlas

**"HuggingFace API error"**

- Verify HUGGINGFACE_API_KEY is correct
- Check API quota is available

**"CORS errors"**

- Ensure CLIENT_URL environment variable is set
- Verify frontend URL is correct

### Frontend Issues

**"Cannot connect to backend"**

- Check VITE_API_URL is correct
- Ensure backend service is running (green indicator on Render)
- Wait 30-60 seconds for free tier to wake up

**"Company email validation failing"**

- Verify COMPANY_EMAIL_DOMAIN is set correctly
- Check the domain matches registration form validation

**"Chatbot not responding"**

- Verify HUGGINGFACE_API_KEY is set on backend
- Check API rate limits haven't been exceeded
- Try a different question

### Performance Issues

**"App is slow"**

- Free Render tier sleeps after 15 minutes
- First request after sleep takes 30-60 seconds
- Visit the URL 2 minutes before showing to someone

**"Files not uploading"**

- Check file size (free tier has limitations)
- Verify MongoDB has storage space
- Check server logs for errors

---

## Configuration Notes

### Company Settings

- **COMPANY_EMAIL_DOMAIN:** Change `techcorp.com` to your actual company domain
- **COMPANY_NAME:** Used in UI and chatbot context

### Security

- **JWT_SECRET:** Use a strong, random string (at least 32 characters)
- **HTTPS:** All connections on Render are HTTPS by default

### Database

- Ensure MongoDB allows connections from Render IPs
- Use connection string with `retryWrites=true&w=majority`

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Render
- [ ] Environment variables configured
- [ ] Backend URL updated in frontend config
- [ ] Frontend URL updated in backend config
- [ ] Company email domain set correctly
- [ ] HuggingFace API key added
- [ ] Application tested with company email
- [ ] File preview tested with different formats
- [ ] Chatbot tested
- [ ] File upload/download working
- [ ] Real-time updates verified

---

## Next Steps (Optional Improvements)

1. **Custom Domain:** Bind Render services to your custom domain
2. **MongoDB Upgrade:** Move to paid MongoDB for persistence
3. **Email Notifications:** Add file sharing notifications
4. **User Management:** Admin dashboard for approving users
5. **File Encryption:** Encrypt sensitive files at rest
6. **Activity Logging:** Track file access for compliance

---

## Support

For issues:

1. Check Render deployment logs
2. Verify all environment variables are set
3. Test with browser developer console
4. Check MongoDB Atlas connection
5. Verify HuggingFace API status

**Deployment Time:** 15-20 minutes
**Cost:** $0 (free tier)
**Live URL:** `https://your-frontend-name.onrender.com`

Happy deploying! 🚀

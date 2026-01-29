# 🏢 TechCorp File Management System

A modern, secure, and company-focused file management application built with the MERN stack (MongoDB, Express, React, Node.js).

## ✨ Key Features

### 🔐 Company-Only Access

- **Email Domain Validation:** Only `@techcorp.com` employees can register
- **Employee Management:** Add department and job title during registration
- **Auto-Approval:** Registered employees are automatically approved
- **Secure Authentication:** JWT-based session management

### 👁️ Smart File Preview System

Supports previewing the most commonly used formats:

- **Images:** JPG, PNG, GIF, WebP, and more
- **Videos:** MP4, WebM, MOV, and standard video formats
- **Audio:** MP3, WAV, OGG, and audio formats
- **Documents:** PDF with page navigation

**Why these formats?** Focus on the most used business file types. Download available for all formats.

### 🤖 Intelligent AI Chatbot

- **Knowledge Base:** Instant answers to common questions
  - File upload help
  - Preview format support
  - Privacy and sharing guidance
  - Company-specific features
- **AI Fallback:** Uses HuggingFace API for general questions
- **Quick Access:** Suggestion buttons for popular topics
- **Always Available:** Floating chat button accessible everywhere

### 📁 Complete File Management

- **Upload:** Drag-and-drop file upload with progress tracking
- **Organize:** Search and sort files by name, date, size
- **Preview:** Inline preview without downloading
- **Download:** One-click download with proper file handling
- **Share:** Mark files as Public (all employees) or Private (only you)
- **Edit:** Update descriptions and privacy settings
- **Delete:** Remove files with confirmation

### ⚡ Real-Time Updates

- Instant file list updates across all sessions
- Socket.io integration for live synchronization
- No page refresh needed
- See changes from other employees immediately

---

## 🛠️ Tech Stack

### Frontend

- **React 18:** Modern UI with hooks
- **Vite:** Lightning-fast build tool
- **Axios:** HTTP client for API calls
- **Socket.io:** Real-time communication
- **React Icons:** Beautiful icon library
- **PDF.js:** PDF rendering in browser

### Backend

- **Node.js:** JavaScript runtime
- **Express:** Web framework
- **MongoDB:** NoSQL database
- **Mongoose:** MongoDB ODM
- **JWT:** Secure authentication
- **Multer:** File upload handling
- **Socket.io:** Real-time updates
- **HuggingFace API:** AI chatbot

---

## 📋 Project Structure

```
project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Chatbot.jsx        # AI assistant
│   │   │   ├── FileGrid.jsx       # File list display
│   │   │   ├── FileUpload.jsx     # Upload area
│   │   │   ├── FilePreview.jsx    # File preview modal
│   │   │   └── Navbar.jsx         # Navigation
│   │   ├── pages/         # Page components
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Register.jsx       # Registration page
│   │   │   └── Dashboard.jsx      # Main app
│   │   ├── context/       # React context
│   │   │   └── AuthContext.jsx    # Auth state
│   │   └── styles/        # CSS modules
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication endpoints
│   │   ├── chat.js       # Chatbot endpoint
│   │   └── files.js      # File management endpoints
│   ├── models/           # MongoDB schemas
│   │   ├── User.js       # User model
│   │   └── File.js       # File model
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # JWT verification
│   │   └── upload.js     # File upload handling
│   ├── config/           # Configuration
│   │   └── db.js         # MongoDB connection
│   ├── index.js          # Server entry point
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md   # Step-by-step deployment
├── DEPLOY_RENDER.md      # Render.com deployment
├── START_HERE.md         # Getting started guide
├── README.md             # This file
└── setup.ps1             # Windows setup script
```

---

## 🚀 Getting Started

### Local Development Setup

#### Windows (PowerShell)

```powershell
# Run the setup script
.\setup.ps1

# Or manual setup:
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

#### macOS/Linux

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Configuration

1. **Create `.env` file in server directory:**

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
COMPANY_EMAIL_DOMAIN=techcorp.com
COMPANY_NAME=TechCorp
HUGGINGFACE_API_KEY=your_huggingface_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
PORT=5000
```

2. **Create `.env` file in client directory:**

```bash
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Running Development Servers

**Terminal 1 - Backend:**

```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### Test Registration

Use a test email with `@techcorp.com` domain:

- Email: `test@techcorp.com`
- Password: Any 6+ character password
- Department: Engineering
- Job Title: Developer

---

## 📖 API Documentation

### Authentication Endpoints

**POST /api/auth/register**

```json
{
  "username": "john_doe",
  "email": "john@techcorp.com",
  "password": "password123",
  "department": "Engineering",
  "jobTitle": "Senior Developer"
}
```

**POST /api/auth/login**

```json
{
  "email": "john@techcorp.com",
  "password": "password123"
}
```

### File Endpoints

**GET /api/files** - List user's files
**POST /api/files/upload** - Upload a file (multipart/form-data)
**GET /api/files/:id** - Get file details
**GET /api/files/:id/stream** - Stream file download
**PUT /api/files/:id** - Update file (description, privacy)
**DELETE /api/files/:id** - Delete file

### Chat Endpoint

**POST /api/chat**

```json
{
  "message": "How do I upload files?"
}
```

Response includes AI-generated or knowledge-base answer.

---

## 🔒 Security Features

- **JWT Authentication:** Secure token-based login
- **Password Hashing:** Bcrypt encryption for passwords
- **Email Validation:** Company domain verification
- **CORS Protection:** Cross-origin request validation
- **File Authorization:** Users can only access their own files
- **Input Validation:** Sanitized input on all endpoints
- **Environment Variables:** Sensitive data protected

---

## 🎯 Company Features

### Employee-Only System

- Restricts access to company domain emails
- Tracks employee department and role
- Easy identification of file owners
- Team-based file sharing

### Privacy Controls

- **Private Files:** Only accessible by owner
- **Public Files:** Visible to all company employees
- **Edit Metadata:** Update descriptions and privacy any time
- **Audit Trail:** See when files were uploaded/modified

### Communication

- **Built-in Help:** AI chatbot for common questions
- **Knowledge Base:** Instant answers about features
- **Company Context:** Chatbot understands company-only features

---

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete deployment instructions to Render.com (free).

### Quick Deploy Summary

1. Push code to GitHub
2. Create Backend service on Render (Node.js)
3. Create Frontend service on Render (Static Site)
4. Configure environment variables
5. Update URLs between backend and frontend
6. Test with company email

**Deployment Time:** 15-20 minutes
**Cost:** Free (Render free tier)

---

## 🆘 Troubleshooting

### "Only company email addresses are allowed"

- Verify you're using `@techcorp.com` email
- Check COMPANY_EMAIL_DOMAIN environment variable

### Files not previewing

- Some file types aren't supported
- Supported: Images, Videos, Audio, PDFs
- Download the file to open it

### Chatbot not responding

- Check HuggingFace API key is set
- Verify API quota is available
- Try a simpler question

### Real-time updates not working

- Verify Socket.io URL is correct in frontend
- Check backend is running
- Look at browser console for errors

### MongoDB connection issues

- Verify connection string is correct
- Check MongoDB IP whitelist
- Ensure database exists

---

## 📊 Performance Tips

### For Best Results:

- Use a 5 Mbps+ internet connection
- Modern browser (Chrome, Firefox, Safari, Edge)
- Clear browser cache if having issues
- Upload files under 100MB for best performance

### Server Performance:

- MongoDB indexes on frequently searched fields
- File streaming instead of loading in memory
- Compression enabled for API responses
- Caching for frequently accessed files

---

## 🗺️ Future Enhancements

- [ ] Advanced search with filters
- [ ] File versioning and history
- [ ] Collaborative editing
- [ ] Email notifications for shares
- [ ] Admin dashboard
- [ ] File encryption at rest
- [ ] Audit logging
- [ ] Two-factor authentication
- [ ] File expiration dates
- [ ] Bandwidth optimization

---

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 👨‍💼 Support

For issues or questions:

1. Check the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. Review [START_HERE.md](START_HERE.md)
3. Check server logs: `npm run dev`
4. Check browser console: F12 → Console tab
5. Use the built-in chatbot for feature questions

---

## 🎉 Key Improvements in This Version

✅ **File Preview:** Limited to images, videos, audio, and PDFs for better performance
✅ **Company Authentication:** Email domain validation for security
✅ **Enhanced Chatbot:** Knowledge base + AI for complete help
✅ **Better UX:** Company-focused messaging and features
✅ **Production Ready:** Deployment guide and environment setup

---

**Made with ❤️ for TechCorp**

Version: 2.0.0
Last Updated: January 2026

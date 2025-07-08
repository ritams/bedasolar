# 🧾 PDF Parser Web App

Minimal web application for uploading single-page PDFs, parsing with LLM, editing extracted data, and generating proposals.

## Quick Start

### 1. Install MongoDB
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify MongoDB is running
mongosh --eval 'db.runCommand("ismaster")'
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 3. Environment Setup
Create `backend/.env`:
```env
OPENROUTER_API_KEY=sk-your-openrouter-key-here
MONGODB_URI=mongodb://localhost:27017/pdfparser
PORT=3001
```

### 4. Run Application
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

Visit `http://localhost:3000`

## Usage

1. **Upload PDF**: Choose a single-page PDF file
2. **Edit Data**: Review and edit extracted fields (name, email, address, invoice number)
3. **Submit**: Save data to MongoDB
4. **Generate Proposal**: Download PDF and HTML proposals

## 📁 Project Structure

```
beda/
├── backend/          # Node.js + Express API
│   ├── services/     # Modular services (PDF, LLM, DB, Proposals)
│   ├── routes/       # API endpoints (/upload, /submit, /generate)
│   └── temp/         # Temporary file storage
├── frontend/         # React + Vite SPA
│   └── src/
│       ├── App.jsx            # Main app component
│       └── components/        # Upload & FormEditor components
└── README.md
```

## 🔧 Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express  
- **Database**: MongoDB
- **PDF Processing**: pdf2pic + Sharp
- **LLM**: OpenRouter (GPT-4 Vision)
- **PDF Generation**: PDFKit

## 📝 API Endpoints

- `POST /api/upload` - Upload PDF, return parsed JSON
- `POST /api/submit` - Save form data to MongoDB  
- `POST /api/generate` - Generate PDF/HTML proposals

Total code: ~250 lines | Completely modular | Ready to run locally 
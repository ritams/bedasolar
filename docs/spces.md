# 🧾 Minimal PDF Parsing Web App — Specification Document

## 📌 Overview

This is a minimal web application for uploading a **single-page PDF**, converting it to an **image**, parsing the image with an **LLM via OpenRouter**, extracting structured data in a predefined JSON schema, displaying that data in an editable **form**, saving the result to **MongoDB**, and allowing the user to **generate a proposal** (in both PDF and HTML format) using a predefined template.

This document describes the full system specification with no ambiguity, targeting an MVP (minimum viable product).

---

## 📁 Tech Stack

### Frontend
- React (recommended: Vite or Create React App)
- Axios (for API calls)
- Minimal CSS or TailwindCSS (optional)
- Built to run locally in dev mode

### Backend
- Node.js + Express
- Multer (for file uploads)
- `pdf-lib` or `pdf-poppler` or `pdf2pic` (for converting PDF to image)
- Sharp or equivalent (for image manipulation)
- Axios (to call OpenRouter API)
- Mongoose (to connect to MongoDB)
- PDFKit (for generating proposal PDF)
- EJS or string templating (for generating proposal HTML)

### Database
- MongoDB (local instance or MongoDB Atlas)
- One collection: `parsed_forms`

---

## 🧭 Functional Requirements

### 1. Upload PDF (Frontend)
- The user uploads a **single-page PDF** using a file input.
- The frontend calls `POST /upload` with the PDF file.
- The UI shows a loading indicator until parsing completes.

### 2. Backend: Convert PDF to Image
- Receive the PDF at `/upload`.
- Save it temporarily.
- Convert the **first page only** to a `.png` or `.jpg` image (screenshot-like).
- Resize if needed (max width/height: 1024px).

### 3. Backend: Parse Image with OpenRouter LLM
- Call OpenRouter’s image API with the generated image and prompt like:
```

Extract the following fields from this invoice image and return a JSON with keys:
name, email, address, invoiceNumber.

````
- API key is provided via `.env` file.

### 4. Return Parsed JSON to Frontend
- Expected format:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "address": "123 Elm St, Cityville",
  "invoiceNumber": "INV-0001"
}
````

* The frontend receives this response and renders a form with the above fields.

### 5. Show Editable Form (Frontend)

* Show a form with fields:

  * Name (text, required)
  * Email (email, required, valid format)
  * Address (multiline text, required)
  * Invoice Number (text, required)
* Include "Submit" and "Generate Proposal" buttons.

### 6. Submit Edited Data

* On form submit, `POST /submit` is called with JSON body of field values.
* The backend:

  * Saves it to the MongoDB `parsed_forms` collection.
  * Adds metadata: `uploadTimestamp`, `originalFilename`.

### 7. Generate Proposal

* Clicking "Generate Proposal" sends `POST /generate` with the latest form data.
* Backend:

  * Uses predefined template to render a **PDF** and an **HTML** version.
  * Template includes user fields in readable format (e.g., “This proposal is for {{name}} regarding invoice {{invoiceNumber}}…”).
  * Returns both files as downloadable blobs or URLs.

---

## 🌐 API Endpoints

### `POST /upload`

* Accepts: single PDF file (`multipart/form-data`)
* Returns: JSON fields `{ name, email, address, invoiceNumber }`

### `POST /submit`

* Accepts: JSON body `{ name, email, address, invoiceNumber }`
* Saves to MongoDB
* Returns: `{ status: "success", _id: "..." }`

### `POST /generate`

* Accepts: JSON body (same as above)
* Returns:

  * `application/pdf` blob (PDF proposal)
  * `text/html` content (HTML proposal)

---

## Template for Proposal

**PDF and HTML will follow this structure:**

```
Proposal for {{name}}

Invoice Number: {{invoiceNumber}}

Address:
{{address}}

We are submitting this proposal based on your request. Feel free to reach out at {{email}}.
```

You can embed basic styling or formatting for both outputs (e.g., headers, paragraphs, bold labels).

---

## 🔒 Environment Variables (.env)

```
OPENROUTER_API_KEY=sk-...
MONGODB_URI=mongodb://localhost:27017/pdfparser
PORT=3001
```

---

## 🧼 Validation Rules

* All fields required.
* `email` must match a valid email format (RFC 5322).
* `invoiceNumber` can be any alphanumeric string.

---

## Non-Requirements (For MVP)

* No user login/authentication
* No multi-page PDF support
* No file persistence (delete after parsing)
* No Docker or cloud deployment needed (local only)

---

## ✅ Goals

* Minimal, readable, modular code
* MVP working locally with no external dependencies except:

  * OpenRouter API
  * Local MongoDB



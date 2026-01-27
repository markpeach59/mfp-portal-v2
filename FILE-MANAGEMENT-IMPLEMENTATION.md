# File Management System - Implementation Guide

## Overview

A complete secure file management system has been implemented with:

- **Backend (mfnode)**: File model, S3 service, and secure API routes
- **Frontend (mfp-portal-v2)**: React components for upload, display, and management

---

## Backend Implementation (mfnode)

### Files Created

1. **`models/file.js`** - MongoDB schema with secure s3Key handling
2. **`services/s3Service.js`** - S3 upload, delete, presigned URLs, and streaming
3. **`routes/files.js`** - API endpoints with authentication
4. **`.env.example`** - Environment variable template
5. **`FILE-API-TESTING.md`** - Complete API testing guide

### Setup Backend

1. **Configure environment variables:**

```bash
cd mfnode
cp .env.example .env
# Edit .env and add your AWS credentials
```

2. **Verify dependencies installed:**

```bash
npm list @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer uuid
```

3. **Start the server:**

```bash
node index.js
```

### API Endpoints

| Endpoint                | Method | Auth | Admin | Description            |
| ----------------------- | ------ | ---- | ----- | ---------------------- |
| `/api/files`            | GET    | ✅   | ❌    | List files by category |
| `/api/files/upload`     | POST   | ✅   | ✅    | Upload file            |
| `/api/files/:id`        | DELETE | ✅   | ✅    | Delete file            |
| `/api/files/:id/url`    | GET    | ✅   | ❌    | Get presigned URL      |
| `/api/files/:id/stream` | GET    | ✅   | ❌    | Stream download        |

---

## Frontend Implementation (mfp-portal-v2)

### Files Created

1. **`src/services/fileApi.js`** - API service wrapper
2. **`src/components/FileUploader.jsx`** - Drag-drop upload component
3. **`src/components/MarketingGallery.jsx`** - Image gallery with lightbox
4. **`src/components/StockList.jsx`** - PDF download component
5. **`src/components/OffersGrid.jsx`** - Offers display grid
6. **`src/components/AdminFileManager.jsx`** - Full admin CRUD interface

### Setup Frontend

1. **Verify dependency installed:**

```bash
npm list react-dropzone
```

2. **The components are ready to use!**

---

## Component Usage

### 1. Stock List Page

```jsx
import StockList from "./components/StockList";

function StockPage() {
  return (
    <div className="page-container">
      <h1>Stock List</h1>
      <StockList />
    </div>
  );
}
```

### 2. Marketing Gallery Page

```jsx
import MarketingGallery from "./components/MarketingGallery";

function MarketingPage() {
  return (
    <div className="page-container">
      <h1>Marketing Materials</h1>
      <MarketingGallery />
    </div>
  );
}
```

### 3. Offers Page

```jsx
import OffersGrid from "./components/OffersGrid";

function OffersPage() {
  return (
    <div className="page-container">
      <h1>Current Offers</h1>
      <OffersGrid />
    </div>
  );
}
```

### 4. Admin File Management

```jsx
import AdminFileManager from "./components/AdminFileManager";
import ProtectedRoute from "./components/protectedadminroute";

// In your routing:
<ProtectedRoute path="/admin/files" component={AdminFileManager} />;
```

---

## File Type Configuration

### Stock

- **Accepts**: PDF only
- **Max Files**: 1 (replaces previous)
- **Use Case**: Current stock list PDF
- **Security**: Stream download only (no direct URLs)

### Marketing

- **Accepts**: Images (JPG, PNG, GIF, WebP) and PDFs
- **Max Files**: 20 per upload
- **Subcategories**:
  - Brochures
  - Social Media
  - Banners
  - Product Photos
  - Logos
  - Other
- **Security**: 15-minute presigned URLs

### Offers

- **Accepts**: Images only (JPG, PNG, GIF, WebP)
- **Max Files**: 10 per upload
- **Use Case**: Promotional offer images
- **Security**: 15-minute presigned URLs

---

## Security Features

### Backend Security

1. **S3 Key Protection**
   - `s3Key` field has `select: false` in schema
   - Never exposed in API responses
   - Only accessible via internal methods

2. **Authentication**
   - All endpoints require valid JWT token
   - Token must be in `x-auth-token` header

3. **Authorization**
   - Upload/delete require `isAdmin: true`
   - Non-admin users get 403 Forbidden

4. **File Streaming**
   - Stock files must use `/stream` endpoint
   - Files proxied through server
   - No direct S3 access

5. **Presigned URLs**
   - 15-minute expiration
   - Temporary access only
   - Not available for stock files

### Frontend Security

1. **JWT Token**
   - Automatically included from localStorage
   - Set via existing auth system

2. **Admin-Only Components**
   - FileUploader only accessible to admins
   - AdminFileManager protected by route guards

3. **Secure Downloads**
   - Stock files downloaded via server proxy
   - No S3 URLs exposed to client

---

## AWS S3 Setup

### Required S3 Bucket Configuration

1. **Bucket Name**: `maximal-dealer-assets` (or your preferred name)
2. **Region**: `eu-west-2` (or your preferred region)
3. **Public Access**: Block all public access
4. **Folder Structure** (created automatically):
   ```
   stock/
   marketing/
     brochures/
     social-media/
     banners/
     product-photos/
     logos/
     other/
   offers/
   ```

### IAM User Permissions

Create an IAM user with the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::maximal-dealer-assets/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::maximal-dealer-assets"
    }
  ]
}
```

### Get AWS Credentials

1. Log into AWS Console
2. Go to IAM → Users → Your User
3. Security credentials tab
4. Create access key → Application running outside AWS
5. Copy Access Key ID and Secret Access Key
6. Add to mfnode `.env` file

---

## Testing the Implementation

### Backend Testing

1. **Start the server:**

```bash
cd mfnode
node index.js
```

2. **Get an admin JWT token** (login as admin user)

3. **Test upload:**

```bash
curl -X POST http://localhost:5000/api/files/upload \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -F "file=@/path/to/test.pdf" \
  -F "category=stock"
```

4. **See FILE-API-TESTING.md** for complete testing examples

### Frontend Testing

1. **Start the React app:**

```bash
cd mfp-portal-v2
npm start
```

2. **Login as admin user**

3. **Navigate to admin file manager**

4. **Test upload workflow:**
   - Drag and drop files
   - Switch between categories
   - Delete files
   - View in respective pages

---

## Integration Steps

### Add to Your App Routing

```jsx
// In your main App.js or routing file
import StockList from './components/StockList';
import MarketingGallery from './components/MarketingGallery';
import OffersGrid from './components/OffersGrid';
import AdminFileManager from './components/AdminFileManager';

// Add routes:
<Route path="/stock" component={StockList} />
<Route path="/marketing" component={MarketingGallery} />
<Route path="/offers" component={OffersGrid} />
<ProtectedRoute path="/admin/files" component={AdminFileManager} />
```

### Add to Navigation

```jsx
// For dealer users
<Link to="/stock">Stock List</Link>
<Link to="/marketing">Marketing</Link>
<Link to="/offers">Offers</Link>

// For admin users (conditional)
{user.isAdmin && (
  <Link to="/admin/files">Manage Files</Link>
)}
```

---

## Component Props

### FileUploader

```jsx
<FileUploader
  category="stock|marketing|offers" // Required
  subcategory="brochures" // Optional (for marketing)
  onUploadComplete={(files) => {}} // Optional callback
/>
```

### MarketingGallery

No props required - fully self-contained.

### StockList

No props required - fully self-contained.

### OffersGrid

No props required - fully self-contained.

### AdminFileManager

No props required - fully self-contained.

---

## Troubleshooting

### Upload Issues

**"Admin access required"**

- Ensure your JWT has `isAdmin: true`
- Login with admin account

**"Invalid file type"**

- Check allowed file types for category
- Stock: PDF only
- Marketing: Images + PDF
- Offers: Images only

**"Upload failed"**

- Check AWS credentials in `.env`
- Verify S3 bucket name is correct
- Check IAM permissions
- Look at server logs for details

### Download Issues

**Stock file won't download**

- Check network connectivity
- Verify JWT token is valid
- Check browser console for errors

**Marketing images not loading**

- Presigned URLs expire after 15 minutes
- Refresh the page to get new URLs
- Check S3 bucket permissions

### Backend Issues

**"Access Denied" from S3**

- Verify AWS credentials in `.env`
- Check IAM user permissions
- Ensure bucket name is correct
- Verify region matches

---

## File Size Limits

- **Current**: 50 MB per file (configurable)
- **Change in**: `.env` → `MAX_FILE_SIZE=52428800`
- **Note**: Also check your server/proxy limits

---

## Next Steps

1. ✅ Add AWS credentials to mfnode `.env`
2. ✅ Create S3 bucket and IAM user
3. ✅ Test backend endpoints
4. ✅ Add routes to your React app
5. ✅ Add navigation links
6. ✅ Upload initial files as admin
7. ✅ Test with regular dealer users

---

## Support

For backend API details, see: `mfnode/FILE-API-TESTING.md`

For component usage, import and use as shown in examples above.

All components follow the existing codebase patterns:

- Class components
- Inline styles
- Existing auth system
- Toast notifications

# S3 Secure File Portal - Frontend Implementation (mfp)

## Overview

Add secure file management UI to the existing mfp React frontend:
- FileUploader component (admin drag-drop upload)
- Marketing gallery with lightbox
- Stock list download (secure, no URL exposed)
- Offers PDF grid
- Admin dashboard for file management

**API Base**: Your existing API URL (mfnode backend)
**Auth**: Uses existing JWT token from localStorage

---

## 1. Install Dependencies

```bash
npm install react-dropzone
```

---

## 2. API Service

Add to your existing API service or create `services/fileApi.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const fileApi = {
  // List files by category
  async list(category, subcategory = null) {
    let url = `${API_URL}/files?category=${category}`;
    if (subcategory) url += `&subcategory=${subcategory}`;
    
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch files');
    return res.json();
  },
  
  // Upload file (admin only)
  async upload(file, category, subcategory = null, description = '') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    if (subcategory) formData.append('subcategory', subcategory);
    if (description) formData.append('description', description);
    
    const res = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },
  
  // Delete file (admin only)
  async delete(fileId) {
    const res = await fetch(`${API_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Delete failed');
    return res.json();
  },
  
  // Get presigned URL (for images/PDFs)
  async getUrl(fileId) {
    const res = await fetch(`${API_URL}/files/${fileId}/url`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to get URL');
    return res.json();
  },
  
  // Download stock file (streams through server)
  async downloadStock(fileId, filename) {
    const res = await fetch(`${API_URL}/files/${fileId}/stream`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Download failed');
    
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
};
```

---

## 3. FileUploader Component

Create `components/FileUploader.jsx`:

```jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { fileApi } from '../services/fileApi';

const CATEGORY_CONFIG = {
  stock: {
    label: 'Stock List',
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    maxFiles: 1,
    description: 'Excel file (.xlsx)'
  },
  marketing: {
    label: 'Marketing Images',
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'], 'application/pdf': ['.pdf'] },
    maxFiles: 20,
    description: 'Images or PDFs'
  },
  offers: {
    label: 'Offers',
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.png'] },
    maxFiles: 10,
    description: 'PDFs or images'
  }
};

export default function FileUploader({ category, subcategory = null, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  
  const config = CATEGORY_CONFIG[category];
  
  const onDrop = useCallback(async (acceptedFiles) => {
    setError(null);
    setUploading(true);
    setProgress(0);
    
    const results = [];
    
    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const result = await fileApi.upload(acceptedFiles[i], category, subcategory);
        results.push(result.file);
        setProgress(Math.round(((i + 1) / acceptedFiles.length) * 100));
      }
      
      if (onUploadComplete) onUploadComplete(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }, [category, subcategory, onUploadComplete]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: config.accept,
    maxFiles: config.maxFiles,
    disabled: uploading
  });
  
  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? '#E31837' : '#D1D5DB'}`,
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          backgroundColor: isDragActive ? '#FEF2F2' : '#F9FAFB',
          transition: 'all 0.2s'
        }}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div>
            <p style={{ color: '#6B7280', marginBottom: '8px' }}>Uploading... {progress}%</p>
            <div style={{ height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#E31837', transition: 'width 0.3s' }} />
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: '#1F2937', fontWeight: 500 }}>
              {isDragActive ? 'Drop files here' : `Upload ${config.label}`}
            </p>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>
              {config.description} • Max {config.maxFiles} file{config.maxFiles > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#FEF2F2', borderRadius: '8px', color: '#DC2626', fontSize: '14px' }}>
          {error}
        </div>
      )}
    </div>
  );
}
```

---

## 4. Marketing Gallery Component

Create `components/MarketingGallery.jsx`:

```jsx
import React, { useState, useEffect } from 'react';
import { fileApi } from '../services/fileApi';

const SUBCATEGORIES = [
  { id: 'brochures', label: 'Brochures' },
  { id: 'social-media', label: 'Social Media' },
  { id: 'banners', label: 'Banners' },
  { id: 'product-photos', label: 'Product Photos' },
  { id: 'logos', label: 'Logos' },
  { id: 'other', label: 'Other' }
];

export default function MarketingGallery() {
  const [activeCategory, setActiveCategory] = useState('brochures');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  
  useEffect(() => {
    loadImages();
  }, [activeCategory]);
  
  const loadImages = async () => {
    setLoading(true);
    try {
      const files = await fileApi.list('marketing', activeCategory);
      
      // Get presigned URLs for each image
      const withUrls = await Promise.all(
        files.map(async (file) => {
          const { url } = await fileApi.getUrl(file._id);
          return { ...file, url };
        })
      );
      
      setImages(withUrls);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {SUBCATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeCategory === cat.id ? '#E31837' : '#F3F4F6',
              color: activeCategory === cat.id ? '#FFFFFF' : '#4B5563',
              fontWeight: 500,
              fontSize: '14px'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
      
      {/* Image Grid */}
      {loading ? (
        <p style={{ color: '#6B7280' }}>Loading...</p>
      ) : images.length === 0 ? (
        <p style={{ color: '#6B7280' }}>No images in this category.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {images.map(img => (
            <div
              key={img._id}
              onClick={() => setLightboxImage(img)}
              style={{
                aspectRatio: '1',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: '#F3F4F6',
                border: '1px solid #E5E7EB'
              }}
            >
              <img
                src={img.url}
                alt={img.originalName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Lightbox */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}
        >
          <img
            src={lightboxImage.url}
            alt={lightboxImage.originalName}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
          <button
            onClick={() => setLightboxImage(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '32px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 5. Stock List Component

Create `components/StockList.jsx`:

```jsx
import React, { useState, useEffect } from 'react';
import { fileApi } from '../services/fileApi';

export default function StockList() {
  const [stockFile, setStockFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  
  useEffect(() => {
    loadStockFile();
  }, []);
  
  const loadStockFile = async () => {
    try {
      const files = await fileApi.list('stock');
      setStockFile(files[0] || null);
    } catch (error) {
      console.error('Failed to load stock file:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = async () => {
    if (!stockFile) return;
    setDownloading(true);
    try {
      await fileApi.downloadStock(stockFile._id, stockFile.originalName);
    } catch (error) {
      alert('Download failed');
    } finally {
      setDownloading(false);
    }
  };
  
  if (loading) return <p>Loading...</p>;
  if (!stockFile) return <p>No stock list available.</p>;
  
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      padding: '24px',
      maxWidth: '400px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#DCFCE7',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '24px' }}>📊</span>
        </div>
        <div>
          <h3 style={{ margin: 0, color: '#1F2937', fontWeight: 600 }}>Stock List</h3>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>
            {(stockFile.size / 1024).toFixed(1)} KB • Updated {new Date(stockFile.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#E31837',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: downloading ? 'not-allowed' : 'pointer',
          opacity: downloading ? 0.7 : 1
        }}
      >
        {downloading ? 'Downloading...' : 'Download Excel'}
      </button>
    </div>
  );
}
```

---

## 6. Offers Grid Component

Create `components/OffersGrid.jsx`:

```jsx
import React, { useState, useEffect } from 'react';
import { fileApi } from '../services/fileApi';

export default function OffersGrid() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadOffers();
  }, []);
  
  const loadOffers = async () => {
    try {
      const files = await fileApi.list('offers');
      
      const withUrls = await Promise.all(
        files.map(async (file) => {
          const { url } = await fileApi.getUrl(file._id);
          return { ...file, url };
        })
      );
      
      setOffers(withUrls);
    } catch (error) {
      console.error('Failed to load offers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <p>Loading offers...</p>;
  if (offers.length === 0) return <p>No offers available.</p>;
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
      {offers.map(offer => (
        <a
          key={offer._id}
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '16px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'box-shadow 0.2s'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#FEF2F2',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{ fontSize: '20px' }}>📄</span>
          </div>
          <div>
            <p style={{ margin: 0, color: '#1F2937', fontWeight: 500 }}>{offer.originalName}</p>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '13px' }}>
              {offer.mimeType === 'application/pdf' ? 'PDF' : 'Image'} • {(offer.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
```

---

## 7. Admin File Manager Component

Create `components/AdminFileManager.jsx`:

```jsx
import React, { useState, useEffect } from 'react';
import FileUploader from './FileUploader';
import { fileApi } from '../services/fileApi';

const MARKETING_SUBCATEGORIES = ['brochures', 'social-media', 'banners', 'product-photos', 'logos', 'other'];

export default function AdminFileManager() {
  const [activeTab, setActiveTab] = useState('stock');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subcategory, setSubcategory] = useState('brochures');
  
  useEffect(() => {
    loadFiles();
  }, [activeTab, subcategory]);
  
  const loadFiles = async () => {
    setLoading(true);
    try {
      const data = await fileApi.list(activeTab, activeTab === 'marketing' ? subcategory : null);
      setFiles(data);
    } catch (error) {
      console.error('Load failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (fileId) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      await fileApi.delete(fileId);
      setFiles(prev => prev.filter(f => f._id !== fileId));
    } catch (error) {
      alert('Delete failed');
    }
  };
  
  const tabs = [
    { id: 'stock', label: 'Stock List' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'offers', label: 'Offers' }
  ];
  
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>File Management</h1>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid #E5E7EB' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              color: activeTab === tab.id ? '#E31837' : '#6B7280',
              borderBottom: activeTab === tab.id ? '2px solid #E31837' : '2px solid transparent',
              marginBottom: '-1px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Subcategory selector for marketing */}
      {activeTab === 'marketing' && (
        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          style={{ marginBottom: '20px', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
        >
          {MARKETING_SUBCATEGORIES.map(sub => (
            <option key={sub} value={sub}>{sub.replace('-', ' ')}</option>
          ))}
        </select>
      )}
      
      {/* Upload */}
      <div style={{ marginBottom: '24px', padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Upload</h2>
        <FileUploader
          category={activeTab}
          subcategory={activeTab === 'marketing' ? subcategory : null}
          onUploadComplete={() => loadFiles()}
        />
      </div>
      
      {/* File List */}
      <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Files ({files.length})</h2>
        
        {loading ? <p>Loading...</p> : files.length === 0 ? <p>No files.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6B7280', fontSize: '12px' }}>FILENAME</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6B7280', fontSize: '12px' }}>SIZE</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6B7280', fontSize: '12px' }}>UPLOADED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => (
                <tr key={file._id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '12px 8px' }}>{file.originalName}</td>
                  <td style={{ padding: '12px 8px', color: '#6B7280' }}>{(file.size / 1024).toFixed(1)} KB</td>
                  <td style={{ padding: '12px 8px', color: '#6B7280' }}>{new Date(file.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(file._id)}
                      style={{ padding: '6px 12px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

---

## Usage in Your App

```jsx
// In your routing/pages:

// Dealer view (regular users)
<Route path="/marketing" element={<MarketingGallery />} />
<Route path="/stock" element={<StockList />} />
<Route path="/offers" element={<OffersGrid />} />

// Admin view (admin only)
<Route path="/admin/files" element={<AdminFileManager />} />
```

---

## Component Summary

| Component | Purpose | User Type |
|-----------|---------|-----------|
| `FileUploader` | Drag-drop upload | Admin |
| `AdminFileManager` | Full CRUD interface | Admin |
| `MarketingGallery` | Browse/view marketing images | All |
| `StockList` | Download stock Excel | All |
| `OffersGrid` | View/download offers | All |

import React, { Component } from 'react';
import { useDropzone } from 'react-dropzone';
import fileApi from '../services/fileApi';

const CATEGORY_CONFIG = {
  stock: {
    label: 'Stock List',
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    description: 'PDF file only'
  },
  marketing: {
    label: 'Marketing Images',
    accept: { 
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'], 
      'application/pdf': ['.pdf'] 
    },
    maxFiles: 20,
    description: 'Images or PDFs'
  },
  offers: {
    label: 'Offers',
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] },
    maxFiles: 10,
    description: 'Images only'
  }
};

// Wrapper component to use react-dropzone hook with class component
function DropzoneWrapper({ onDrop, config, uploading, children }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: config.accept,
    maxFiles: config.maxFiles,
    disabled: uploading
  });
  
  return children({ getRootProps, getInputProps, isDragActive });
}

class FileUploader extends Component {
  state = {
    uploading: false,
    progress: 0,
    error: null
  };
  
  handleDrop = async (acceptedFiles) => {
    const { category, subcategory, onUploadComplete } = this.props;
    
    this.setState({ error: null, uploading: true, progress: 0 });
    
    const results = [];
    
    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const response = await fileApi.uploadFile(
          acceptedFiles[i], 
          category, 
          subcategory
        );
        results.push(response.data.file);
        this.setState({ progress: Math.round(((i + 1) / acceptedFiles.length) * 100) });
      }
      
      if (onUploadComplete) {
        onUploadComplete(results);
      }
      
      // Reset state after successful upload
      setTimeout(() => {
        this.setState({ uploading: false, progress: 0 });
      }, 500);
      
    } catch (err) {
      this.setState({ 
        error: err.response?.data?.error || err.message || 'Upload failed',
        uploading: false 
      });
    }
  };
  
  render() {
    const { category } = this.props;
    const { uploading, progress, error } = this.state;
    const config = CATEGORY_CONFIG[category];
    
    if (!config) {
      return <div>Invalid category</div>;
    }
    
    return (
      <div>
        <DropzoneWrapper 
          onDrop={this.handleDrop} 
          config={config} 
          uploading={uploading}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
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
                  <p style={{ color: '#6B7280', marginBottom: '8px' }}>
                    Uploading... {progress}%
                  </p>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#E5E7EB', 
                    borderRadius: '4px', 
                    overflow: 'hidden' 
                  }}>
                    <div style={{ 
                      width: `${progress}%`, 
                      height: '100%', 
                      backgroundColor: '#E31837', 
                      transition: 'width 0.3s' 
                    }} />
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <svg 
                      width="48" 
                      height="48" 
                      fill="none" 
                      stroke={isDragActive ? '#E31837' : '#9CA3AF'} 
                      viewBox="0 0 24 24"
                      style={{ margin: '0 auto', display: 'block' }}
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                      />
                    </svg>
                  </div>
                  <p style={{ color: '#1F2937', fontWeight: 500, marginBottom: '4px' }}>
                    {isDragActive ? 'Drop files here' : `Upload ${config.label}`}
                  </p>
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>
                    {config.description} • Max {config.maxFiles} file{config.maxFiles > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          )}
        </DropzoneWrapper>
        
        {error && (
          <div style={{ 
            marginTop: '12px', 
            padding: '12px', 
            backgroundColor: '#FEF2F2', 
            borderRadius: '8px', 
            color: '#DC2626', 
            fontSize: '14px',
            border: '1px solid #FEE2E2'
          }}>
            {error}
          </div>
        )}
      </div>
    );
  }
}

export default FileUploader;

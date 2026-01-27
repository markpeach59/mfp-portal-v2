import http from "./httpService";
import config from "../config.json";

const apiEndpoint = config.apiURL + "/files";

// List files by category and optional subcategory
export function listFiles(category, subcategory = null) {
  let url = `${apiEndpoint}?category=${category}`;
  if (subcategory) {
    url += `&subcategory=${subcategory}`;
  }
  return http.get(url);
}

// Upload file (admin only)
export function uploadFile(file, category, subcategory = null, description = '') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  if (subcategory) {
    formData.append('subcategory', subcategory);
  }
  if (description) {
    formData.append('description', description);
  }
  
  return http.post(`${apiEndpoint}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// Delete file (admin only)
export function deleteFile(fileId) {
  return http.delete(`${apiEndpoint}/${fileId}`);
}

// Get presigned URL (for images/PDFs)
export function getFileUrl(fileId) {
  return http.get(`${apiEndpoint}/${fileId}/url`);
}

// Download stock file (streams through server)
export async function downloadStockFile(fileId, filename) {
  const response = await fetch(`${apiEndpoint}/${fileId}/stream`, {
    headers: {
      'x-auth-token': localStorage.getItem('token')
    }
  });
  
  if (!response.ok) {
    throw new Error('Download failed');
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

const exportedFileApi = {
  listFiles,
  uploadFile,
  deleteFile,
  getFileUrl,
  downloadStockFile
};

export default exportedFileApi;

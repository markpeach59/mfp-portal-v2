// API URL resolution — reads from REACT_APP_API_URL env var at build time,
// falling back to the Maximal production URL if not set.
const apiConfig = {
  apiURL: process.env.REACT_APP_API_URL || 'http://35.179.170.23:3900/api'
};

export default apiConfig;

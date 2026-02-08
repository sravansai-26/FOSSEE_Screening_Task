import axios from 'axios';

/**
 * PRODUCTION URL: Replace this with your actual Render URL after deployment.
 * Example: "https://fossee-backend-sravan.onrender.com/api"
 */
const PROD_URL = "https://fossee-screening-task.onrender.com";
const LOCAL_URL = "http://127.0.0.1:8000/api";

// Automatically switch base URL based on environment
const API_BASE_URL = window.location.hostname === "localhost" ? LOCAL_URL : PROD_URL;

export const uploadCSV = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE_URL}/upload/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getHistory = () => {
    return axios.get(`${API_BASE_URL}/history/`);
};
import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Ensure 'export' is present before 'const'
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
import api from './api';

const laborerService = {
    
    getAllLaborers: (params = {}) => {
        return api.get('/laborers', { params });
    },

    
    getLaborerById: (id) => {
        return api.get(`/laborers/${id}`);
    },

    
    createLaborer: (laborerData) => {
        return api.post('/laborers', laborerData);
    },

    
    updateLaborer: (id, laborerData) => {
        return api.put(`/laborers/${id}`, laborerData);
    },

    
    deleteLaborer: (id) => {
        return api.delete(`/laborers/${id}`);
    },

    
    getLaborerStats: (id) => {
        return api.get(`/laborers/${id}/stats`);
    },
};

export default laborerService;

import api from './api';

const contractorService = {
    
    getAllContractors: (params = {}) => {
        return api.get('/contractors', { params });
    },

    
    getContractorById: (id) => {
        return api.get(`/contractors/${id}`);
    },

    
    createContractor: (contractorData) => {
        return api.post('/contractors', contractorData);
    },

    
    updateContractor: (id, contractorData) => {
        return api.put(`/contractors/${id}`, contractorData);
    },

    
    deleteContractor: (id) => {
        return api.delete(`/contractors/${id}`);
    },

    
    getContractorStats: (id) => {
        return api.get(`/contractors/${id}/stats`);
    },
};

export default contractorService;

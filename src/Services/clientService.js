import api from './api';

const clientService = {
    
    getAllClients: (params = {}) => {
        return api.get('/clients', { params });
    },

    
    getClientById: (id) => {
        return api.get(`/clients/${id}`);
    },

    
    createClient: (clientData) => {
        return api.post('/clients', clientData);
    },

    
    updateClient: (id, clientData) => {
        return api.put(`/clients/${id}`, clientData);
    },

    
    deleteClient: (id) => {
        return api.delete(`/clients/${id}`);
    },

    
    getClientProjects: (id) => {
        return api.get(`/clients/${id}/projects`);
    },
};

export default clientService;

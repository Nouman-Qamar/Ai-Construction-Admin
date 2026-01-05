import api from './api';

const bidService = {
    // Get all bids with optional filters
    getAllBids: (params = {}) => {
        return api.get('/bids', { params });
    },

    // Get single bid by ID
    getBidById: (id) => {
        return api.get(`/bids/${id}`);
    },

    // Create new bid
    createBid: (bidData) => {
        return api.post('/bids', bidData);
    },

    // Update bid
    updateBid: (id, bidData) => {
        return api.put(`/bids/${id}`, bidData);
    },

    // Delete bid
    deleteBid: (id) => {
        return api.delete(`/bids/${id}`);
    },

    // Accept bid
    acceptBid: (id, reviewedBy) => {
        return api.post(`/bids/${id}/accept`, { reviewedBy });
    },

    // Reject bid
    rejectBid: (id, reviewedBy) => {
        return api.post(`/bids/${id}/reject`, { reviewedBy });
    },

    // Get bids by project
    getBidsByProject: (projectId) => {
        return api.get(`/bids/project/${projectId}`);
    },
};

export default bidService;

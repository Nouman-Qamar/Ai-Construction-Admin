import api from './api';

const verificationService = {
    
    getAllVerificationRequests: () => {
        return api.get('/verification/requests');
    },

    
    approveVerification: (id) => {
        return api.post(`/verification/${id}/approve`);
    },

    
    rejectVerification: (id, reason) => {
        return api.post(`/verification/${id}/reject`, { reason });
    },
};

export default verificationService;

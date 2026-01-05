import api from './api';

const suspensionService = {
    
    getSuspendedAccounts: () => {
        return api.get('/suspension/accounts');
    },

    
    suspendAccount: (id, reason) => {
        return api.post(`/suspension/${id}/suspend`, { reason });
    },

    
    unsuspendAccount: (id) => {
        return api.post(`/suspension/${id}/unsuspend`);
    },
};

export default suspensionService;

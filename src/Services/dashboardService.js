import api from './api';

const dashboardService = {
    
    getDashboardStats: () => {
        return api.get('/dashboard/stats');
    },

    
    getRecentUsers: (limit = 5) => {
        return api.get('/dashboard/recent-users', {
            params: { limit },
        });
    },

   
    getRecentProjects: (limit = 5) => {
        return api.get('/dashboard/recent-projects', {
            params: { limit },
        });
    },
};

export default dashboardService;

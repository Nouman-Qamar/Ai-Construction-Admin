import api from './api';

const projectService = {
    
    getAllProjects: (params = {}) => {
        return api.get('/projects', { params });
    },

   
    getProjectById: (id) => {
        return api.get(`/projects/${id}`);
    },

    
    createProject: (projectData) => {
        return api.post('/projects', projectData);
    },

    
    updateProject: (id, projectData) => {
        return api.put(`/projects/${id}`, projectData);
    },

   
    deleteProject: (id) => {
        return api.delete(`/projects/${id}`);
    },

    
    updateProjectStatus: (id, status) => {
        return api.patch(`/projects/${id}/status`, { status });
    },

    
    cancelProject: (id, reason, cancelledBy) => {
        return api.post(`/projects/${id}/cancel`, {
            reason,
            cancelledBy,
        });
    },

    
    getActiveProjects: () => {
        return api.get('/projects/active');
    },

    
    getCompletedProjects: () => {
        return api.get('/projects/completed');
    },

   
    getPendingProjects: () => {
        return api.get('/projects/pending');
    },
};

export default projectService;

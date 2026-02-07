import api from './api';

const authService = {
    // Get current user profile
    getProfile: () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return Promise.resolve({ data: user });
    },

    // Update user profile
    updateProfile: (profileData) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return api.put(`/users/${user._id}`, profileData).then(response => {
            // Update localStorage with new data
            const updatedUser = { ...user, ...profileData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return response;
        });
    },

    // Change password
    changePassword: (passwordData) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return api.post(`/users/${user._id}/change-password`, passwordData);
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
};

export default authService;

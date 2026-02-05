import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing authentication on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Verify user is admin
        if (parsedUser.role === 'admin') {
          setToken(storedToken);
          setUser(parsedUser);
        } else {
          // Not an admin, clear storage
          localStorage.clear();
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.clear();
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = (userData, authToken) => {
    // Verify user is admin
    if (userData.role !== 'admin') {
      message.error('Access denied. Admin privileges required.');
      return false;
    }

    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    message.success('Login successful!');
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.info('Logged out successfully');
    navigate('/login');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(token && user && user.role === 'admin');
  };

  // Update user data
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

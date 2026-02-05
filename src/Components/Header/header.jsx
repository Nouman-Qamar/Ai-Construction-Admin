import { Avatar, Dropdown, Space, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Text } = Typography;

const HeaderPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleProfile = () => {
    navigate('/admin/profile');
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: handleProfile,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 24px',
      width: '100%',
    }}>
      <div>
        <Text strong style={{ fontSize: '18px' }}>
          Admin Dashboard
        </Text>
      </div>

      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement="bottomRight"
      >
        <Space style={{ cursor: 'pointer' }}>
          <Avatar 
            icon={<UserOutlined />} 
            src={user?.profilePicture}
            style={{ backgroundColor: '#1890ff' }}
          />
          <Space direction="vertical" size={0}>
            <Text strong>{user?.name || 'Admin'}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {user?.role || 'Administrator'}
            </Text>
          </Space>
        </Space>
      </Dropdown>
    </div>
  );
};

export default HeaderPage;

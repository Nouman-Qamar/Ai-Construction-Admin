import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Button, Spin, message } from "antd";
import {
  UserOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard statistics
      const dashboardResponse = await axiosInstance.get('/dashboard');
      console.log('Dashboard stats:', dashboardResponse);
      
      if (dashboardResponse.data) {
        setStats({
          totalUsers: dashboardResponse.data.totalUsers || 0,
          totalProjects: dashboardResponse.data.totalProjects || 0,
          activeProjects: dashboardResponse.data.activeProjects || 0,
          completedProjects: dashboardResponse.data.completedProjects || 0,
        });
      }

      // Fetch recent users
      try {
        const usersResponse = await axiosInstance.get('/users', {
          params: { limit: 5, page: 1 }
        });
        console.log('Recent users:', usersResponse);
        
        if (usersResponse.data) {
          setRecentUsers(usersResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }

      // Fetch recent projects
      try {
        const projectsResponse = await axiosInstance.get('/projects', {
          params: { limit: 5, page: 1 }
        });
        console.log('Recent projects:', projectsResponse);
        
        if (projectsResponse.data) {
          setRecentProjects(projectsResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      contractor: "blue",
      laborer: "green",
      client: "volcano",
      admin: "purple",
      user: "cyan",
    };
    return colors[role?.toLowerCase()] || "default";
  };

  const userColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color={getRoleColor(role)}>{role || 'N/A'}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (isVerified) => (
        <Tag color={isVerified ? "green" : "orange"}>
          {isVerified ? "Verified" : "Pending"}
        </Tag>
      ),
    },
  ];

  const projectColumns = [
    {
      title: "Project",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      render: (text, record) => record.client?.name || 'N/A',
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          pending: "orange",
          active: "blue",
          completed: "green",
          cancelled: "red",
        };
        return (
          <Tag color={colors[status?.toLowerCase()] || "default"}>
            {status || 'N/A'}
          </Tag>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <Spin size="large" tip="Loading dashboard data..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "20px" }}>Admin Dashboard</h1>

      {/* Statistics Cards */}
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Projects"
              value={stats.totalProjects}
              prefix={<ProjectOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Projects"
              value={stats.activeProjects}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed Projects"
              value={stats.completedProjects}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Users Table */}
      <Card title="Recent Users" style={{ marginTop: 30 }}>
        <Table
          dataSource={recentUsers}
          columns={userColumns}
          pagination={false}
          rowKey={(record) => record._id || record.id}
          locale={{ emptyText: "No users found" }}
        />

        <Button 
          type="primary" 
          style={{ marginTop: 15 }}
          onClick={() => navigate('/users')}
        >
          View All Users
        </Button>
      </Card>

      {/* Recent Projects Table */}
      <Card title="Recent Projects" style={{ marginTop: 30 }}>
        <Table
          dataSource={recentProjects}
          columns={projectColumns}
          pagination={false}
          rowKey={(record) => record._id || record.id}
          locale={{ emptyText: "No projects found" }}
        />

        <Button 
          type="primary" 
          style={{ marginTop: 15 }}
          onClick={() => navigate('/projects')}
        >
          View All Projects
        </Button>
      </Card>
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Button, Spin } from "antd";
import {
  UserOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
  
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const dummyDashboardData = {
    stats: {
      totalUsers: 128,
      totalProjects: 42,
      activeProjects: 8,
      completedProjects: 21,
    },

    recentUsers: [
      { _id: "1", name: "Ali Raza", role: "Contractor", verified: true },
      { _id: "2", name: "Ahmed Khan", role: "Labor", verified: false },
      { _id: "3", name: "Zain Malik", role: "Client", verified: true },
    ],

    recentProjects: [
      {
        _id: "101",
        title: "House Construction - DHA",
        client: "Zain Malik",
        status: "Active",
      },
      {
        _id: "102",
        title: "Plumbing Work",
        client: "Ali Raza",
        status: "Pending Approval",
      },
      {
        _id: "103",
        title: "Grey Structure Build",
        client: "Ahmed Khan",
        status: "Completed",
      },
    ],
  };

  
  useEffect(() => {
    

    setTimeout(() => {
      setStats(dummyDashboardData.stats);
      setRecentUsers(dummyDashboardData.recentUsers);
      setRecentProjects(dummyDashboardData.recentProjects);
      setLoading(false);
    }, 800);
  }, [
    dummyDashboardData.stats,
    dummyDashboardData.recentUsers,
    dummyDashboardData.recentProjects,
  ]); 

  const getRoleColor = (role) => {
    if (role === "Contractor") {
      return "blue";
    } else if (role === "Labor") {
      return "green";
    } else {
      return "volcano"; 
    }
  };

  const userColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Role",
      dataIndex: "role",

      render: (role) => <Tag color={getRoleColor(role)}>{role}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "verified",
      render: (verified) => {
        if (verified) {
          return <Tag color="green">Verified</Tag>;
        } else {
          return <Tag color="red">Pending</Tag>;
        }
      },
    },
  ];

  const projectColumns = [
    {
      title: "Project",
      dataIndex: "title",
    },
    {
      title: "Client",
      dataIndex: "client",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const colors = {
          "Pending Approval": "orange",
          Active: "blue",
          Completed: "green",
          Cancelled: "red",
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
  ];

  
  if (loading)
    return <Spin size="large" style={{ marginTop: 80, display: "block" }} />;

  
  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "20px" }}>Admin Dashboard</h1>

    
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Total Projects"
              value={stats.totalProjects}
              prefix={<ProjectOutlined />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Active Projects"
              value={stats.activeProjects}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Completed Projects"
              value={stats.completedProjects}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      
      <Card title="Recent Users" style={{ marginTop: 30 }}>
        <Table
          dataSource={recentUsers}
          columns={userColumns}
          pagination={false}
          rowKey="_id"
        />

        <Button type="primary" style={{ marginTop: 15 }}>
          View All Users
        </Button>
      </Card>

      
      <Card title="Recent Projects" style={{ marginTop: 30 }}>
        <Table
          dataSource={recentProjects}
          columns={projectColumns}
          pagination={false}
          rowKey="_id"
        />

        <Button type="primary" style={{ marginTop: 15 }}>
          View All Projects
        </Button>
      </Card>
    </div>
  );
};

export default Dashboard;

import { useState } from "react";
import "./App.css";
import { Button, Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import Sidebar from "./Components/Sidebar/sidebar";
import HeaderPage from "./Components/Header/header";

import Dashboard from "./Components/Landing-Page/landing";
import Profile from "./Components/Pages/Profile/Profile";
import AllProjects from "./Components/Pages/Project/AllProjects";
import Contractors from "./Components/Pages/User/Contractors";
import Laborers from "./Components/Pages/User/Laborers";

import { Routes, Route, Navigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sider"
      >
        <Sidebar />

        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="trigger"
        />
        <hr />
      </Sider>

      <Layout>
        <Header className="header">
          <HeaderPage />
        </Header>

        <Content className="content">
          <Routes>
            {/* Default route → Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* Admin profile */}
            <Route path="/admin/profile" element={<Profile />} />

            {/* All Projects */}
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/bids-overview" element={<AllProjects />} />
            <Route path="/cancel-projects" element={<AllProjects />} />

            {/* Contractors */}
            <Route path="/contractors" element={<Contractors />} />
            {/* Laborers */}
            <Route path="/laborers" element={<Laborers />} />

            {/* Redirect unknown routes to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;

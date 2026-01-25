import { useState } from "react";
import "./App.css";
import { Button, Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

import HeaderPage from "./Components/Header/header";

import Dashboard from "./Components/Landing-Page/landing";
import Profile from "./Components/Pages/Admin Setting/Profile/Profile";
import AllProjects from "./Components/Pages/Project/AllProjects";
import Contractors from "./Components/Pages/User/Contractors/Contractors";
import Laborers from "./Components/Pages/User/Laborers/Laborers";
import AllUser from "./Components/User Management/all users/AU";
import AllClients from "./Components/User Management/all clients/AU";

import { Routes, Route, Navigate } from "react-router-dom";
import Activeproject from "./Components/Pages/Project/active project/active";

import Verification from "./Components/Pages/User/Verification request/VerificationRequests";
import Suspend from "./Components/Pages/User/Suspended account/SuspendedAccounts";
import Sidebar from "./Components/Sidebar/sidebar";
import Speciality from "./Components/Pages/Admin Setting/Speciality/Specialty";

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
      <Activeproject />
      <Layout>
        <Header className="header">
          <HeaderPage />
        </Header>

        

        <Content className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin/profile" element={<Profile />} />
            <Route path="/admin/speciality" element={<Speciality />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/bids-overview" element={<AllProjects />} />
            <Route path="/cancel-projects" element={<AllProjects />} />
            <Route path="/contractors" element={<Contractors />} />
            <Route path="/laborers" element={<Laborers />} />
            <Route path="/users" element={<AllUser />} />
            <Route path="/all-clients" element={<AllClients />} />
            <Route path="/verification-requests" element={<Verification />} />
            <Route path="/suspended-accounts" element={<Suspend />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;

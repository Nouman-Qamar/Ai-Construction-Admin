import { useState } from "react";
import "./App.css";
import { Button, Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

import HeaderPage from "./Components/Header/header";
import Dashboard from "./Components/Landing-Page/landing";
import Profile from "./Components/Pages/Profile/Profile";
import AllProjects from "./Components/Pages/Project/AllProjects";
import Contractors from "./Components/Pages/User/Contractors/Contractors";
import Laborers from "./Components/Pages/User/Laborers/Laborers";
import AllUser from "./Components/User Management/all users/AU";
import AllClients from "./Components/User Management/all clients/AU";
import Verification from "./Components/Pages/User/Verification request/VerificationRequests";
import Suspend from "./Components/Pages/User/Suspended account/SuspendedAccounts";
import Sidebar from "./Components/Sidebar/sidebar";
import Login from "./Components/Auth/Login";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";

import { Routes, Route, Navigate } from "react-router-dom";
import Activeproject from "./Components/Pages/Project/activeProject/active";

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Routes>
      {/* Public Route - Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes - Require Authentication */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
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
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/admin/profile" element={<Profile />} />

                    <Route path="/projects" element={<AllProjects />} />
                    <Route path="/bids-overview" element={<AllProjects />} />
                    <Route path="/cancel-projects" element={<AllProjects />} />
                    <Route path="/active-projects" element={<Activeproject />} />

                    <Route path="/contractors" element={<Contractors />} />
                    <Route path="/laborers" element={<Laborers />} />

                    <Route path="/users" element={<AllUser />} />
                    <Route path="/all-clients" element={<AllClients />} />

                    <Route path="/verification-requests" element={<Verification />} />
                    <Route path="/suspended-accounts" element={<Suspend />} />

                    {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
                  </Routes>
                </Content>
              </Layout>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
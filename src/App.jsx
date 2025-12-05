import { useState } from "react";
import "./App.css";
import { Button, Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar/sidebar";
import HeaderPage from "./Components/Header/header";
import AllUser from "./Components/User Management/all users/AU";
import AllClients from "./Components/User Management/all clients/AU";

const { Header, Sider, Content } = Layout;
function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
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
          ></Button>
          <hr />
        </Sider>
        <Layout>
          <Header className="header"> <HeaderPage/> </Header>
          <Content className="content">
            <Routes>
              <Route path="/" element={<AllUser />} />
              <Route path="/users" element={<AllUser />} />
              <Route path="/clients" element={<AllClients />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;

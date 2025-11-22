import { useState } from "react";
import "./App.css";
import { Button, Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import Sidebar from "./Components/Sidebar/sidebar";
import HeaderPage from "./Components/Header/header";

const { Header, Sider, Content } = Layout;
function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
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
          <Content className="content">Content</Content>
        </Layout>
      </Layout>
    </>
  );
}

export default App;

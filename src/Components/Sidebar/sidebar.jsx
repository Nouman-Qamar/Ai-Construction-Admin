import { Flex, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

import { MdDashboard, MdOutlineManageAccounts } from "react-icons/md";
import { AiOutlineProject } from "react-icons/ai";
import { RiUserSettingsLine } from "react-icons/ri";

function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  // Auto select item based on current route
  const selectedKey = (() => {
    if (path === "/" || path === "/dashboard") return "1";

    if (path === "/contractors") return "2-3";
    if (path === "/laborers") return "2-4";
    if (path === "/clients") return "2-2";
    if (path === "/verification") return "2-5";

    if (path === "/projects") return "3-1";

    if (path === "/admin/profile") return "8";

    return "1";
  })();

  // Auto open parent submenu
  const openKeys = (() => {
    if (selectedKey.startsWith("2")) return ["2"];
    if (selectedKey.startsWith("3")) return ["3"];
    return [];
  })();

  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <MdDashboard size={28} />
        </div>
      </Flex>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={openKeys}
        className="menu-bar"
        style={{ background: "#FFF9F2" }}
        items={[
          {
            key: "1",
            icon: <MdDashboard />,
            label: <Link to="/">Dashboard</Link>,
          },

          {
            key: "2",
            icon: <MdOutlineManageAccounts />,
            label: "User Management",
            children: [
              { key: "2-1", label: "All Users" },
              { key: "2-2", label: <Link to="/clients">Clients (Owners)</Link> },
              { key: "2-3", label: <Link to="/contractors">Contractors</Link> },
              { key: "2-4", label: <Link to="/laborers">Laborers</Link> },
              { key: "2-5", label: "Verification Requests" },
              { key: "2-6", label: "Suspended Accounts" },
            ],
          },

          {
            key: "3",
            icon: <AiOutlineProject />,
            label: "Project Management",
            children: [
              { key: "3-1", label: <Link to="/projects">All Projects</Link> },
              
            ],
          },

          {
            key: "8",
            icon: <RiUserSettingsLine />,
            label: <Link to="/admin/profile">Admin Profile</Link>,
          },
        ]}
      />
    </>
  );
}

export default Sidebar;

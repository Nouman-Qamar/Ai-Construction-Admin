import { Flex, Menu } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdDashboard, MdOutlineManageAccounts } from "react-icons/md";
import { AiOutlineProject } from "react-icons/ai";
import { RiUserSettingsLine } from "react-icons/ri";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">Logo</div>
      </Flex>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={["3"]}
        className="menu-bar"
        style={{ background: "#FFF9F2" }}

        // 🔥 This is important → click will navigate
        onClick={(item) => navigate(item.key)}

        items={[
          {
            key: "/", // route
            icon: <MdDashboard />,
            label: "Dashboard",
          },

          {
            key: "3",
            icon: <AiOutlineProject />,
            label: "Project Management",
            children: [
              {
                key: "/all-projects", // FIXED route
                label: "All Projects",
              },
            ],
          },

          {
            key: "/admin/profile",
            icon: <RiUserSettingsLine />,
            label: "Admin Profile",
          },
        ]}
      />
    </>
  );
}

export default Sidebar;

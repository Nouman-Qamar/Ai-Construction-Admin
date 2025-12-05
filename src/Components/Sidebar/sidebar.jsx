import { Flex, Menu } from "antd";
import { Link } from "react-router-dom";

import { 
  MdDashboard,
  MdOutlineManageAccounts
} from "react-icons/md";

import { 
  AiOutlineProject
} from "react-icons/ai";


import { 
  RiUserSettingsLine 
} from "react-icons/ri";



function Sidebar() {
  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <MdDashboard size={28}/>
        </div>
      </Flex>

      <Menu 
        theme="light"
        mode="inline"
        defaultSelectedKeys={['1']}
        className="menu-bar"
        style={{
          background: "#FFF9F2",   
        }}
        items={[

          {
            key: '1',
            icon: <MdDashboard />,
            label: <Link to="/">Dashboard</Link>,
             
          },

          {
            key: '2',
            icon: <MdOutlineManageAccounts />,
            label: 'User Management',
            children: [
              { key: '2-1', label: 'All Users' },
              { key: '2-2', label: 'Clients (Owners)' },
              { key: '2-3', label: <Link to="/contractors">Contractors</Link> },
              { key: '2-4', label: <Link to="/laborers">Laborers</Link> },
              { key: '2-5', label: 'Verification Requests' },
              { key: '2-6', label: 'Suspended Accounts' }
            ]
          },

          {
            key: '3',
            icon: <AiOutlineProject />,
            label: <Link to="/projects">Project Management</Link>,
            children: [
              { key: '3-1', label: <Link to="/projects">All Projects</Link> },
            ]
          },

          {
            key: '8',
            icon: <RiUserSettingsLine />,
             label: <Link to="/admin/profile">Admin Profile</Link>,
          },
        ]}
      />
    </>
  );
}
export default Sidebar;
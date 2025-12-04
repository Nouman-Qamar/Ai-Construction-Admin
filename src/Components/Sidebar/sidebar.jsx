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
              { key: '2-3', label: 'Contractors' },
              { key: '2-4', label: 'Laborers' },
              { key: '2-5', label: <Link to ="/verification"> Verification Requests</Link> },
              { key: '2-6', label: <Link to="suspend" >Suspended Accounts</Link> }
            ]
          },

          {
            key: '3',
            icon: <AiOutlineProject />,
            label: 'Project Management',
            children: [
              { key: '3-1', label: 'All Projects' },
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
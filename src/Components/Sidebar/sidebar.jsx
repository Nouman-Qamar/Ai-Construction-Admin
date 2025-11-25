import { Flex, Menu } from "antd";

import { 
  MdDashboard,
  MdOutlineManageAccounts,
  MdOutlinePayments,
  MdOutlineSettings
} from "react-icons/md";

import { 
  AiOutlineProject,
  AiOutlineNotification
} from "react-icons/ai";

import { 
  BiAnalyse 
} from "react-icons/bi";

import { 
  RiUserSettingsLine 
} from "react-icons/ri";

import { 
  IoMdConstruct, 
  IoMdChatbubbles 
} from "react-icons/io";

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
            label: 'Dashboard',
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
              { key: '2-5', label: 'Verification Requests' },
              { key: '2-6', label: 'Suspended Accounts' }
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
            label: 'Admin Profile',
          },
        ]}
      />
    </>
  );
}
export default Sidebar;
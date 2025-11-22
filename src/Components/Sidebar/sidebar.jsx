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
              { key: '3-2', label: 'Pending Approval' },
              { key: '3-3', label: 'Active Projects' },
              { key: '3-4', label: 'Completed Projects' },
              { key: '3-5', label: 'Cancelled Projects' },
              { key: '3-6', label: 'Bids Overview' }
            ]
          },

         
          {
            key: '4',
            icon: <IoMdChatbubbles />,
            label: 'Dispute Center',
            children: [
              { key: '4-1', label: 'Open Disputes' },
              { key: '4-2', label: 'Ongoing Cases' },
              { key: '4-3', label: 'Resolved Disputes' },
            ]
          },

          {
            key: '5',
            icon: <MdOutlinePayments />,
            label: 'Payments & Finance',
            children: [
              { key: '5-1', label: 'All Transactions' },
              { key: '5-2', label: 'Pending Payments' },
              { key: '5-3', label: 'Withdrawals / Refund Requests' },
              { key: '5-4', label: 'Subscriptions' },
              { key: '5-5', label: 'Revenue Reports' },
            ]
          },

          
          {
            key: '6',
            icon: <BiAnalyse />,
            label: 'Analytics & Reports',
            children: [
              { key: '6-1', label: 'User Statistics' },
              { key: '6-2', label: 'Project Trends' },
              { key: '6-3', label: 'Performance Scores' },
              { key: '6-4', label: 'Financial Reports' },
            ]
          },

         
          {
            key: '7',
            icon: <IoMdConstruct />,
            label: 'AI Cost Engine',
            children: [
              { key: '7-1', label: 'Material Prices' },
              { key: '7-2', label: 'API Integrations' },
              { key: '7-3', label: 'Estimate Logs' },
              { key: '7-4', label: 'Override Estimates' },
            ]
          },

         
          {
            key: '8',
            icon: <AiOutlineNotification />,
            label: 'Announcements & Policies',
            children: [
              { key: '8-1', label: 'Announcements' },
              { key: '8-2', label: 'Policies & Terms' },
              { key: '8-3', label: 'Pricing Updates' },
            ]
          },

          
          {
            key: '9',
            icon: <MdOutlineSettings />,
            label: 'System Settings',
            children: [
              { key: '9-1', label: 'Admin Roles' },
              { key: '9-2', label: 'Security Logs' },
              { key: '9-3', label: 'Backups' },
              { key: '9-4', label: 'Configurations' },
            ]
          },

         
          {
            key: '10',
            icon: <RiUserSettingsLine />,
            label: 'Admin Profile',
            children: [
              { key: '10-1', label: 'Profile' },
              { key: '10-2', label: 'Settings' },
              { key: '10-3', label: 'Logout' },
            ]
          },
        ]}
      />
    </>
  );
}

export default Sidebar;

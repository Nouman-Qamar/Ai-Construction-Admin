import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Space, Tag, Tooltip, Empty, Spin } from "antd";
import { USERS_DATA, USER_ROLES, USER_STATUS } from "./Constant";
import { getColumns } from "./column";
import "./AU.css";

function AllUser() {
  // Initialize from localStorage if available, otherwise use USERS_DATA
  const [users, setUsers] = useState(() => {
    try {
      const savedUsers = localStorage.getItem("users");
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        // Validate that parsed data is an array
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure all IDs are numbers
          return parsed.map(u => ({
            ...u,
            id: typeof u.id === 'string' ? parseInt(u.id, 10) : u.id
          }));
        }
      }
    } catch (error) {
      console.error("Error loading users from localStorage:", error);
      localStorage.removeItem("users");
    }
    return [...USERS_DATA];
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Save users to localStorage whenever they change
  console.log("Current users state:", users);
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const showViewModal = (user) => {
    setSelectedUser(user);
    setIsViewModalVisible(true);
  };

  const handleDelete = (userId) => {
    console.log("Opening delete modal for user:", userId);
    setUserToDelete(userId);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    console.log("Confirming delete for user:", userToDelete);
    console.log("Current users before delete:", users);
    
    if (userToDelete !== null && userToDelete !== undefined) {
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter((user) => user.id !== userToDelete);
        console.log("Users after delete:", updatedUsers);
        return updatedUsers;
      });
      setIsDeleteModalVisible(false);
      setUserToDelete(null);
      console.log("User deleted successfully");
    } else {
      console.log("No user selected for deletion");
    }
  };

  const cancelDelete = () => {
    console.log("Delete cancelled");
    setIsDeleteModalVisible(false);
    setUserToDelete(null);
  };

  const showEditModal = (user) => {
    setSelectedUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form validated, values:", values);
      
      if (selectedUser) {
        // Edit existing user
        console.log("Editing user:", selectedUser.id);
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? { ...user, ...values } : user
          )
        );
      } else {
        // Add new user
        console.log("Adding new user");
        const ids = users.map(u => u.id);
        const maxId = ids.length > 0 ? Math.max(...ids) : 0;
        const newUser = {
          id: maxId + 1,
          ...values,
          joinDate: new Date().toISOString().split('T')[0],
        };
        console.log("New user created:", newUser);
        setUsers((prev) => [...prev, newUser]);
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setSelectedUser(null);
      console.log("Modal closed");
    } catch (error) {
      console.error("Validation or add user error:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsViewModalVisible(false);
    form.resetFields();
    setSelectedUser(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Inactive":
        return "orange";
      case "Suspended":
        return "red";
      default:
        return "default";
    }
  };

  const columns = getColumns({
    getStatusColor,
    showViewModal,
    showEditModal,
    handleDelete,
  });


  console.log("Rendering AllUser component with users:", filteredUsers);

  return (
    <div className="all-users-container">
      <div className="users-header">
        <h1>All Users</h1>
        <p>Manage and view all registered users in the system</p>
      </div>

      <div className="users-controls">
        <Input
          placeholder="Search by name or email..."
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "300px" }}
        />
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            setSelectedUser(null);
            setIsModalVisible(true);
          }}
        >
          + Add New User
        </Button>
        <Button 
          onClick={() => console.log("Current users:", users)}
          type="dashed"
        >
          Log Users (Debug)
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey={(record) => record.id}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          locale={{ emptyText: <Empty description="No users found" /> }}
          className="users-table"
        />
      </Spin>

      <Modal
        title={selectedUser ? "Edit User" : "Add New User"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter user name" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select
              placeholder="Select role"
              options={USER_ROLES}
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select
              placeholder="Select status"
              options={USER_STATUS}
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="User Details"
        open={isViewModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {selectedUser && (
          <div className="user-details">
            <p>
              <strong>Name:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedUser.phone}
            </p>
            <p>
              <strong>Role:</strong> <Tag color="blue">{selectedUser.role}</Tag>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color={getStatusColor(selectedUser.status)}>
                {selectedUser.status}
              </Tag>
            </p>
            <p>
              <strong>Join Date:</strong> {selectedUser.joinDate}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Delete User"
        open={isDeleteModalVisible}
        onCancel={cancelDelete}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          type: "primary",
        }}
        onOk={confirmDelete}
        confirmLoading={loading}
      >
        <p>Are you sure you want to delete this user? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

export default AllUser;
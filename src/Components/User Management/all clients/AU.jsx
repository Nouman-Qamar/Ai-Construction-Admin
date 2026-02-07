import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Tag, message, Spin, Space } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/axiosInstance";
import "./AU.css";

const { Option } = Select;

function AllUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, searchText]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
      };

      if (searchText) {
        params.search = searchText;
      }

      const response = await axiosInstance.get('/users', { params });
      console.log('Users response:', response);

      if (response.data) {
        setUsers(response.data);
        setPagination({
          ...pagination,
          total: response.total || response.data.length,
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      total: pagination.total,
    });
  };

  const showViewModal = (user) => {
    setSelectedUser(user);
    setIsViewModalVisible(true);
  };

  const showEditModal = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    });
    setIsModalVisible(true);
  };

  const showDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalVisible(true);
  };

  const handleAddUser = () => {
    form.resetFields();
    setSelectedUser(null);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (selectedUser) {
        // Update existing user
        const response = await axiosInstance.put(`/users/${selectedUser._id}`, values);
        message.success('User updated successfully');
      } else {
        // Create new user
        const response = await axiosInstance.post('/users', {
          ...values,
          password: values.password || 'TempPassword@123', // Temporary password
        });
        message.success('User created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      setSelectedUser(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error saving user:', error);
      message.error(error.response?.data?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/users/${userToDelete._id}`);
      message.success('User deleted successfully');
      setIsDeleteModalVisible(false);
      setUserToDelete(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsViewModalVisible(false);
    setIsDeleteModalVisible(false);
    form.resetFields();
    setSelectedUser(null);
    setUserToDelete(null);
  };

  const getStatusColor = (isActive) => {
    return isActive ? "green" : "red";
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "purple",
      client: "volcano",
      contractor: "blue",
      laborer: "green",
      user: "cyan",
    };
    return colors[role?.toLowerCase()] || "default";
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => text || 'N/A',
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {role?.toUpperCase() || 'N/A'}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={getStatusColor(isActive)}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (isVerified) => (
        <Tag color={isVerified ? "green" : "orange"}>
          {isVerified ? "Verified" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Join Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showViewModal(record)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteModal(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

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
          onPressEnter={fetchUsers}
          style={{ width: "300px" }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddUser}
        >
          Add New User
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey={(record) => record._id}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          onChange={handleTableChange}
          className="users-table"
        />
      </Spin>

      {/* Add/Edit User Modal */}
      <Modal
        title={selectedUser ? "Edit User" : "Add New User"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={600}
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
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter email" disabled={!!selectedUser} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="client">Client</Option>
              <Option value="contractor">Contractor</Option>
              <Option value="laborer">Laborer</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>

          {!selectedUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          <Form.Item
            name="isActive"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* View User Modal */}
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
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
            <p>
              <strong>Role:</strong>{" "}
              <Tag color={getRoleColor(selectedUser.role)}>
                {selectedUser.role?.toUpperCase()}
              </Tag>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color={getStatusColor(selectedUser.isActive)}>
                {selectedUser.isActive ? "Active" : "Inactive"}
              </Tag>
            </p>
            <p>
              <strong>Verified:</strong>{" "}
              <Tag color={selectedUser.isVerified ? "green" : "orange"}>
                {selectedUser.isVerified ? "Verified" : "Pending"}
              </Tag>
            </p>
            <p>
              <strong>Join Date:</strong>{" "}
              {new Date(selectedUser.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete User"
        open={isDeleteModalVisible}
        onCancel={handleCancel}
        onOk={confirmDelete}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        confirmLoading={loading}
      >
        <p>
          Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default AllUser;

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, Tag, message, Spin } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/axiosInstance";
import "./AU.css";

function AllClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchClients();
  }, [pagination.current, pagination.pageSize, searchText]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
      };

      if (searchText) {
        params.search = searchText;
      }

      // Use /clients endpoint which returns only users with role='client'
      const response = await axiosInstance.get('/clients', { params });
      console.log('Clients response:', response);

      if (response.data || response) {
        const data = response.data || response;
        setClients(Array.isArray(data) ? data : []);
        setPagination({
          ...pagination,
          total: response.total || (Array.isArray(data) ? data.length : 0),
        });
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      message.error('Failed to load clients');
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

  const showViewModal = (client) => {
    setSelectedClient(client);
    setIsViewModalVisible(true);
  };

  const showEditModal = (client) => {
    setSelectedClient(client);
    form.setFieldsValue({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
    });
    setIsModalVisible(true);
  };

  const showDeleteModal = (client) => {
    setClientToDelete(client);
    setIsDeleteModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (selectedClient) {
        // Update existing client
        await axiosInstance.put(`/clients/${selectedClient._id}`, values);
        message.success('Client updated successfully');
      } else {
        // Create new client
        await axiosInstance.post('/clients', {
          ...values,
          role: 'client', // Ensure role is set to client
        });
        message.success('Client created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      setSelectedClient(null);
      fetchClients();
    } catch (error) {
      console.error('Error saving client:', error);
      message.error(error.response?.data?.message || 'Failed to save client');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/clients/${clientToDelete._id}`);
      message.success('Client deleted successfully');
      setIsDeleteModalVisible(false);
      setClientToDelete(null);
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      message.error('Failed to delete client');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsViewModalVisible(false);
    setIsDeleteModalVisible(false);
    form.resetFields();
    setSelectedClient(null);
    setClientToDelete(null);
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
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (text) => text || 'N/A',
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
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
        <h1>All Clients</h1>
        <p>Manage and view all client users in the system</p>
      </div>

      <div className="users-controls">
        <Input
          placeholder="Search by name, email, or company..."
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={fetchClients}
          style={{ width: "300px" }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setSelectedClient(null);
            setIsModalVisible(true);
          }}
        >
          Add New Client
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={clients}
          rowKey={(record) => record._id}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} clients`,
          }}
          onChange={handleTableChange}
          className="users-table"
        />
      </Spin>

      {/* Add/Edit Client Modal */}
      <Modal
        title={selectedClient ? "Edit Client" : "Add New Client"}
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
            rules={[{ required: true, message: "Please enter client name" }]}
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
            <Input placeholder="Enter email" disabled={!!selectedClient} />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item name="company" label="Company">
            <Input placeholder="Enter company name" />
          </Form.Item>

          {!selectedClient && (
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
        </Form>
      </Modal>

      {/* View Client Modal */}
      <Modal
        title="Client Details"
        open={isViewModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {selectedClient && (
          <div className="user-details">
            <p><strong>Name:</strong> {selectedClient.name}</p>
            <p><strong>Email:</strong> {selectedClient.email}</p>
            <p><strong>Phone:</strong> {selectedClient.phone || 'N/A'}</p>
            <p><strong>Company:</strong> {selectedClient.company || 'N/A'}</p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color={selectedClient.isActive ? "green" : "red"}>
                {selectedClient.isActive ? "Active" : "Inactive"}
              </Tag>
            </p>
            <p>
              <strong>Verified:</strong>{" "}
              <Tag color={selectedClient.isVerified ? "green" : "orange"}>
                {selectedClient.isVerified ? "Verified" : "Pending"}
              </Tag>
            </p>
            <p>
              <strong>Join Date:</strong>{" "}
              {new Date(selectedClient.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Client"
        open={isDeleteModalVisible}
        onCancel={handleCancel}
        onOk={confirmDelete}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        confirmLoading={loading}
      >
        <p>
          Are you sure you want to delete <strong>{clientToDelete?.name}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default AllClients;

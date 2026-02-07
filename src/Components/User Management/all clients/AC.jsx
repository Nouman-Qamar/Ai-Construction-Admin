import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Space, Tag, Tooltip, Empty, Spin, message } from "antd";
import { CLIENT_STATUS } from "./Constant";
import { getColumns } from "./column";
import clientService from "../../../Services/clientService";
import "./AC.css";

function AllClients() {
  const [clients, setClients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch clients from backend
  const fetchClients = async (page = 1, limit = 10, search = "") => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search: search || undefined,
      };
      
      const response = await clientService.getAllClients(params);

      // Normalize response: support array, { data: [...] }, or { success, data }
      let items = [];
      let meta = {};
      if (Array.isArray(response)) {
        items = response;
      } else if (response && response.data) {
        items = response.data.data ?? response.data;
        meta = {
          currentPage: response.data.currentPage,
          limit: response.data.limit,
          total: response.data.total,
        };
      } else if (response && response.success && response.data) {
        items = response.data.data ?? response.data;
        meta = {
          currentPage: response.data.currentPage,
          limit: response.data.limit,
          total: response.data.total,
        };
      } else if (response && response.items) {
        items = response.items;
      } else if (response) {
        items = response;
      }

      if (!Array.isArray(items)) items = items ? [items] : [];

      setClients(items);
      setPagination({
        current: meta.currentPage || page,
        pageSize: meta.limit || limit,
        total: meta.total ?? items.length,
      });
    } catch (error) {
      console.error("Error fetching clients:", error);
      message.error(error.response?.data?.message || "Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  // Load clients on component mount
  useEffect(() => {
    fetchClients(pagination.current, pagination.pageSize, searchText);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchClients(1, pagination.pageSize, searchText);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const handleTableChange = (newPagination) => {
    fetchClients(newPagination.current, newPagination.pageSize, searchText);
  };

  const showViewModal = (client) => {
    setSelectedClient(client);
    setIsViewModalVisible(true);
  };

  const handleDelete = (client) => {
    console.log("Opening delete modal for client:", client);
    setClientToDelete(client);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      setLoading(true);
      await clientService.deleteClient(clientToDelete._id || clientToDelete.id);
      message.success("Client deleted successfully");
      setIsDeleteModalVisible(false);
      setClientToDelete(null);
      // Refresh the list
      fetchClients(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      console.error("Error deleting client:", error);
      message.error(error.response?.data?.message || "Failed to delete client");
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setClientToDelete(null);
  };

  const showEditModal = (client) => {
    setSelectedClient(client);
    // Map backend field names to form fields
    const formData = {
      company: client.company,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      address: client.address,
      status: client.status,
      projects: client.projectCount || 0,
    };
    form.setFieldsValue(formData);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Map form fields to backend expected fields
      const clientData = {
        company: values.company,
        contactPerson: values.contactPerson,
        email: values.email,
        phone: values.phone,
        address: values.address || "",
        status: values.status,
        projectCount: parseInt(values.projects) || 0,
      };

      if (selectedClient) {
        // Edit existing client
        await clientService.updateClient(
          selectedClient._id || selectedClient.id,
          clientData
        );
        message.success("Client updated successfully");
      } else {
        // Add new client
        await clientService.createClient(clientData);
        message.success("Client created successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      setSelectedClient(null);
      
      // Refresh the list
      fetchClients(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      console.error("Error saving client:", error);
      if (error.errorFields) {
        // Validation error
        return;
      }
      message.error(error.response?.data?.message || "Failed to save client");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsViewModalVisible(false);
    form.resetFields();
    setSelectedClient(null);
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

  return (
    <div className="all-users-container">
      <div className="users-header">
        <h1>All Clients</h1>
        <p>Manage and view all registered clients in the system</p>
      </div>

      <div className="users-controls">
        <Input
          placeholder="Search by company or email..."
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "300px" }}
        />
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            setSelectedClient(null);
            setIsModalVisible(true);
          }}
        >
          + Add New Client
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={clients}
          rowKey={(record) => record._id || record.id}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} clients`,
          }}
          onChange={handleTableChange}
          locale={{ emptyText: <Empty description="No clients found" /> }}
          className="users-table"
        />
      </Spin>

      <Modal
        title={selectedClient ? "Edit Client" : "Add New Client"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText={selectedClient ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="company"
            label="Company Name"
            rules={[{ required: true, message: "Please enter company name" }]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>
          <Form.Item
            name="contactPerson"
            label="Contact Person"
            rules={[{ required: true, message: "Please enter contact person name" }]}
          >
            <Input placeholder="Enter contact person name" />
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
            name="address"
            label="Address"
          >
            <Input.TextArea placeholder="Enter address" rows={3} />
          </Form.Item>
          <Form.Item
            name="projects"
            label="Number of Projects"
            rules={[{ required: true, message: "Please enter number of projects" }]}
          >
            <Input type="number" placeholder="Enter number of projects" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select
              placeholder="Select status"
              options={CLIENT_STATUS}
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>

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
            <p>
              <strong>Company:</strong> {selectedClient.company}
            </p>
            <p>
              <strong>Contact Person:</strong> {selectedClient.contactPerson}
            </p>
            <p>
              <strong>Email:</strong> {selectedClient.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedClient.phone}
            </p>
            {selectedClient.address && (
              <p>
                <strong>Address:</strong> {selectedClient.address}
              </p>
            )}
            <p>
              <strong>Projects:</strong>{" "}
              <Tag color="blue">
                {selectedClient.projectCount || selectedClient.projects || 0} projects
              </Tag>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color={getStatusColor(selectedClient.status)}>
                {selectedClient.status}
              </Tag>
            </p>
            <p>
              <strong>Join Date:</strong>{" "}
              {selectedClient.createdAt
                ? new Date(selectedClient.createdAt).toLocaleDateString()
                : selectedClient.joinDate || "N/A"}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Delete Client"
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
        <p>Are you sure you want to delete this client? This action cannot be undone.</p>
        {clientToDelete && (
          <p>
            <strong>Client:</strong> {clientToDelete.company}
          </p>
        )}
      </Modal>
    </div>
  );
}

export default AllClients;

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Space, Tag, Tooltip, Empty, Spin } from "antd";
import { CLIENTS_DATA, CLIENT_STATUS } from "./Constant";
import { getColumns } from "./column";
import "./AC.css";

function AllClients() {

  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem("clients");
    if (savedClients) {
      const parsed = JSON.parse(savedClients);
      return parsed.map(c => ({
        ...c,
        id: typeof c.id === 'string' ? parseInt(c.id, 10) : c.id
      }));
    }
    return [...CLIENTS_DATA];
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Save clients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
    console.log("Clients saved to localStorage");
  }, [clients]);

  const filteredClients = clients.filter(
    (client) =>
      client.company.toLowerCase().includes(searchText.toLowerCase()) ||
      client.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const showViewModal = (client) => {
    setSelectedClient(client);
    setIsViewModalVisible(true);
  };

  const handleDelete = (clientId) => {
    console.log("Opening delete modal for client:", clientId);
    setClientToDelete(clientId);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    console.log("Confirming delete for client:", clientToDelete);
    if (clientToDelete) {
      setClients((prevClients) => prevClients.filter((client) => client.id !== clientToDelete));
      setIsDeleteModalVisible(false);
      setClientToDelete(null);
      console.log("Client deleted successfully");
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setClientToDelete(null);
  };

  const showEditModal = (client) => {
    setSelectedClient(client);
    form.setFieldsValue(client);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form validated, values:", values);
      
      if (selectedClient) {
        // Edit existing client
        console.log("Editing client:", selectedClient.id);
        setClients(
          clients.map((client) =>
            client.id === selectedClient.id ? { ...client, ...values } : client
          )
        );
      } else {
        // Add new client
        console.log("Adding new client");
        const ids = clients.map(c => c.id);
        const maxId = ids.length > 0 ? Math.max(...ids) : 0;
        const newClient = {
          id: maxId + 1,
          ...values,
          joinDate: new Date().toISOString().split('T')[0],
        };
        console.log("New client created:", newClient);
        setClients((prev) => [...prev, newClient]);
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setSelectedClient(null);
      console.log("Modal closed");
    } catch (error) {
      console.error("Validation or add client error:", error);
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
        <Button 
          onClick={() => console.log("Current clients:", clients)}
          type="dashed"
        >
          Log Clients (Debug)
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredClients}
          rowKey={(record) => record.id}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} clients`,
          }}
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
            <p>
              <strong>Projects:</strong> <Tag color="blue">{selectedClient.projects} projects</Tag>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color={getStatusColor(selectedClient.status)}>
                {selectedClient.status}
              </Tag>
            </p>
            <p>
              <strong>Join Date:</strong> {selectedClient.joinDate}
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
      </Modal>
    </div>
  );
}

export default AllClients;
import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Space, Tag, Tooltip, Empty, Spin, message } from "antd";
import { CLIENT_STATUS } from "./Constant";
import { getColumns } from "./column";
import  clientService from "../Services/clientService.js";
import "./AU.css";

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
    
    
    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await clientService.getAllClients();
            // Map backend data to frontend format
            const clientsData = response.data.map((client) => ({
                id: client.client_id,
                company: client.company,
                contactPerson: client.contactPerson,
                email: client.email,
                phone: client.phone || "N/A",
                projects: client.projectCount || 0,
                status: client.status || "Active",
                joinDate: client.createdAt ? new Date(client.createdAt).toISOString().split('T')[0] : "N/A",
            }));
            setClients(clientsData);
        } catch (error) {
            console.error("Error fetching clients:", error);
            message.error("Failed to fetch clients data");
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(
        (client) =>
            client.company.toLowerCase().includes(searchText.toLowerCase()) ||
            client.email.toLowerCase().includes(searchText.toLowerCase()) ||
            client.contactPerson.toLowerCase().includes(searchText.toLowerCase())
    );

    const showViewModal = (client) => {
        setSelectedClient(client);
        setIsViewModalVisible(true);
    };

    const handleDelete = (clientId) => {
        setClientToDelete(clientId);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (clientToDelete) {
            setLoading(true);
            try {
                await clientService.deleteClient(clientToDelete);
                message.success("Client deleted successfully");
                fetchClients(); // Refresh the list
                setIsDeleteModalVisible(false);
                setClientToDelete(null);
            } catch (error) {
                console.error("Error deleting client:", error);
                message.error("Failed to delete client");
            } finally {
                setLoading(false);
            }
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
            setLoading(true);

            if (selectedClient) {
                // Edit existing client
                await clientService.updateClient(selectedClient.id, values);
                message.success("Client updated successfully");
            } else {
                // Add new client
                await clientService.createClient(values);
                message.success("Client created successfully");
            }
            
            fetchClients(); // Refresh the list
            setIsModalVisible(false);
            form.resetFields();
            setSelectedClient(null);
        } catch (error) {
            console.error("Error saving client:", error);
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
                    placeholder="Search by company, contact person, or email..."
                    className="search-input"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: "400px" }}
                />
                <Button
                    type="primary"
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
                    dataSource={filteredClients}
                    rowKey={(record) => record.id}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]} - ${range[1]} of ${total} clients`,
                    }}
                    locale={{ emptyText: <Empty description="No clients found" /> }}
                    className="users-table"
                />
            </Spin>

            {/* Add/Edit Modal */}
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
                    >
                        <Input type="number" placeholder="Enter number of projects" disabled={!!selectedClient} />
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

            {/* View Modal */}
            <Modal
                title="Client Details"
                open={isViewModalVisible}
                onCancel={handleCancel}
                footer={
                    <Button key="close" onClick={handleCancel}>
                        Close
                    </Button>
                }
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

            {/* Delete Confirmation Modal */}
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

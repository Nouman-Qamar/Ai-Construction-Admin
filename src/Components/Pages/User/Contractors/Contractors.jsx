import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Tag, message, Spin, Space } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import axiosInstance from "../../../../api/axiosInstance";
import "./Contractors.css";

const Contractors = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [contractorToDelete, setContractorToDelete] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchContractors();
  }, [pagination.current, pagination.pageSize, searchText]);

  const fetchContractors = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
      };

      if (searchText) {
        params.search = searchText;
      }

      const response = await axiosInstance.get('/contractors', { params });
      console.log('Contractors response:', response);

      if (response.data || response) {
        const data = response.data || response;
        setContractors(Array.isArray(data) ? data : []);
        setPagination({
          ...pagination,
          total: response.total || (Array.isArray(data) ? data.length : 0),
        });
      }
    } catch (error) {
      console.error('Error fetching contractors:', error);
      message.error('Failed to load contractors');
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

  const showViewModal = (contractor) => {
    setSelectedContractor(contractor);
    setIsViewModalVisible(true);
  };

  const showEditModal = (contractor) => {
    setSelectedContractor(contractor);
    form.setFieldsValue({
      name: contractor.name,
      email: contractor.email,
      phone: contractor.phone,
      specialty: contractor.specialty,
    });
    setIsEditModalVisible(true);
  };

  const showDeleteModal = (contractor) => {
    setContractorToDelete(contractor);
    setIsDeleteModalVisible(true);
  };

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await axiosInstance.put(`/contractors/${selectedContractor._id}`, values);
      message.success('Contractor updated successfully');
      
      setIsEditModalVisible(false);
      form.resetFields();
      setSelectedContractor(null);
      fetchContractors();
    } catch (error) {
      console.error('Error updating contractor:', error);
      message.error(error.response?.data?.message || 'Failed to update contractor');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/contractors/${contractorToDelete._id}`);
      message.success('Contractor deleted successfully');
      
      setIsDeleteModalVisible(false);
      setContractorToDelete(null);
      fetchContractors();
    } catch (error) {
      console.error('Error deleting contractor:', error);
      message.error('Failed to delete contractor');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsViewModalVisible(false);
    setIsEditModalVisible(false);
    setIsDeleteModalVisible(false);
    form.resetFields();
    setSelectedContractor(null);
    setContractorToDelete(null);
  };

  const getSpecialtyColor = (specialty) => {
    const colors = {
      'Plumbing': '#1890ff',
      'Electrical': '#faad14',
      'Carpentry': '#52c41a',
      'Masonry': '#722ed1',
      'Painting': '#eb2f96',
      'HVAC': '#13c2c2',
    };
    return colors[specialty] || '#1890ff';
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
      title: "Specialty",
      dataIndex: "specialty",
      key: "specialty",
      render: (specialty) => specialty ? (
        <Tag color={getSpecialtyColor(specialty)}>{specialty}</Tag>
      ) : 'N/A',
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => rating ? `⭐ ${rating}` : 'N/A',
    },
    {
      title: "Projects",
      dataIndex: "projectsCompleted",
      key: "projectsCompleted",
      render: (count) => count || 0,
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

  const filteredData = contractors.filter(
    (contractor) =>
      contractor.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      contractor.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      contractor.specialty?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="contractors-wrapper">
      <div className="contractors-header">
        <h2 className="contractors-title">Contractors</h2>
        <p>Manage and view all contractor users in the system</p>
      </div>

      <div className="contractors-search-section">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by name, email, or specialty..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="contractors-search-input"
          style={{ width: "300px" }}
        />
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey={(record) => record._id}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} contractors`,
          }}
          onChange={handleTableChange}
          className="contractors-table"
        />
      </Spin>

      {/* View Modal */}
      <Modal
        title="Contractor Details"
        open={isViewModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {selectedContractor && (
          <div className="contractor-details">
            <p><strong>Name:</strong> {selectedContractor.name}</p>
            <p><strong>Email:</strong> {selectedContractor.email}</p>
            <p><strong>Phone:</strong> {selectedContractor.phone || 'N/A'}</p>
            <p>
              <strong>Specialty:</strong>{" "}
              {selectedContractor.specialty ? (
                <Tag color={getSpecialtyColor(selectedContractor.specialty)}>
                  {selectedContractor.specialty}
                </Tag>
              ) : 'N/A'}
            </p>
            <p><strong>Rating:</strong> {selectedContractor.rating ? `⭐ ${selectedContractor.rating}` : 'N/A'}</p>
            <p><strong>Projects Completed:</strong> {selectedContractor.projectsCompleted || 0}</p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color={selectedContractor.isActive ? "green" : "red"}>
                {selectedContractor.isActive ? "Active" : "Inactive"}
              </Tag>
            </p>
            <p>
              <strong>Verified:</strong>{" "}
              <Tag color={selectedContractor.isVerified ? "green" : "orange"}>
                {selectedContractor.isVerified ? "Verified" : "Pending"}
              </Tag>
            </p>
            <p>
              <strong>Join Date:</strong>{" "}
              {new Date(selectedContractor.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Contractor"
        open={isEditModalVisible}
        onOk={handleEdit}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
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
            <Input placeholder="Enter email" disabled />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item name="specialty" label="Specialty">
            <Input placeholder="Enter specialty" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Contractor"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={loading}
      >
        <p>
          Are you sure you want to delete <strong>{contractorToDelete?.name}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default Contractors;

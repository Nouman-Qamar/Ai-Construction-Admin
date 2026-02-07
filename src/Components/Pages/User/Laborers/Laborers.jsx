import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Tag, message, Spin, Space } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import axiosInstance from "../../../../api/axiosInstance";
import "./Laborers.css";

const Laborers = () => {
  const [laborers, setLaborers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedLaborer, setSelectedLaborer] = useState(null);
  const [laborerToDelete, setLaborerToDelete] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchLaborers();
  }, [pagination.current, pagination.pageSize, searchText]);

  const fetchLaborers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
      };

      if (searchText) {
        params.search = searchText;
      }

      const response = await axiosInstance.get('/laborers', { params });
      console.log('Laborers response:', response);

      if (response.data || response) {
        const data = response.data || response;
        setLaborers(Array.isArray(data) ? data : []);
        setPagination({
          ...pagination,
          total: response.total || (Array.isArray(data) ? data.length : 0),
        });
      }
    } catch (error) {
      console.error('Error fetching laborers:', error);
      message.error('Failed to load laborers');
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

  const showViewModal = (laborer) => {
    setSelectedLaborer(laborer);
    setIsViewModalVisible(true);
  };

  const showEditModal = (laborer) => {
    setSelectedLaborer(laborer);
    form.setFieldsValue({
      name: laborer.name,
      email: laborer.email,
      phone: laborer.phone,
      skills: laborer.skills,
    });
    setIsEditModalVisible(true);
  };

  const showDeleteModal = (laborer) => {
    setLaborerToDelete(laborer);
    setIsDeleteModalVisible(true);
  };

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await axiosInstance.put(`/laborers/${selectedLaborer._id}`, values);
      message.success('Laborer updated successfully');
      
      setIsEditModalVisible(false);
      form.resetFields();
      setSelectedLaborer(null);
      fetchLaborers();
    } catch (error) {
      console.error('Error updating laborer:', error);
      message.error(error.response?.data?.message || 'Failed to update laborer');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/laborers/${laborerToDelete._id}`);
      message.success('Laborer deleted successfully');
      
      setIsDeleteModalVisible(false);
      setLaborerToDelete(null);
      fetchLaborers();
    } catch (error) {
      console.error('Error deleting laborer:', error);
      message.error('Failed to delete laborer');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsViewModalVisible(false);
    setIsEditModalVisible(false);
    setIsDeleteModalVisible(false);
    form.resetFields();
    setSelectedLaborer(null);
    setLaborerToDelete(null);
  };

  const getSkillColor = (skill) => {
    const colors = {
      'Helper': '#1890ff',
      'Mason': '#52c41a',
      'Painter': '#eb2f96',
      'Electrician': '#faad14',
      'Plumber': '#13c2c2',
      'Carpenter': '#722ed1',
    };
    return colors[skill] || '#1890ff';
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
      title: "Skills",
      dataIndex: "skills",
      key: "skills",
      render: (skills) => skills ? (
        <Tag color={getSkillColor(skills)}>{skills}</Tag>
      ) : 'N/A',
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      render: (exp) => exp ? `${exp} years` : 'N/A',
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

  const filteredData = laborers.filter(
    (laborer) =>
      laborer.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      laborer.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      laborer.skills?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="laborers-wrapper">
      <div className="laborers-header">
        <h2 className="laborers-title">Laborers</h2>
        <p>Manage and view all laborer users in the system</p>
      </div>

      <div className="laborers-search-section">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by name, email, or skills..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="laborers-search-input"
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
              `${range[0]}-${range[1]} of ${total} laborers`,
          }}
          onChange={handleTableChange}
          className="laborers-table"
        />
      </Spin>

      {/* View Modal */}
      <Modal
        title="Laborer Details"
        open={isViewModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {selectedLaborer && (
          <div className="laborer-details">
            <p><strong>Name:</strong> {selectedLaborer.name}</p>
            <p><strong>Email:</strong> {selectedLaborer.email}</p>
            <p><strong>Phone:</strong> {selectedLaborer.phone || 'N/A'}</p>
            <p>
              <strong>Skills:</strong>{" "}
              {selectedLaborer.skills ? (
                <Tag color={getSkillColor(selectedLaborer.skills)}>
                  {selectedLaborer.skills}
                </Tag>
              ) : 'N/A'}
            </p>
            <p><strong>Experience:</strong> {selectedLaborer.experience ? `${selectedLaborer.experience} years` : 'N/A'}</p>
            <p><strong>Projects Completed:</strong> {selectedLaborer.projectsCompleted || 0}</p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color={selectedLaborer.isActive ? "green" : "red"}>
                {selectedLaborer.isActive ? "Active" : "Inactive"}
              </Tag>
            </p>
            <p>
              <strong>Verified:</strong>{" "}
              <Tag color={selectedLaborer.isVerified ? "green" : "orange"}>
                {selectedLaborer.isVerified ? "Verified" : "Pending"}
              </Tag>
            </p>
            <p>
              <strong>Join Date:</strong>{" "}
              {new Date(selectedLaborer.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Laborer"
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

          <Form.Item name="skills" label="Skills">
            <Input placeholder="Enter skills" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Laborer"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={loading}
      >
        <p>
          Are you sure you want to delete <strong>{laborerToDelete?.name}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default Laborers;

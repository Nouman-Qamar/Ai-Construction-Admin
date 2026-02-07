import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Tag, message, Spin, Space, DatePicker } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/axiosInstance";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, [pagination.current, pagination.pageSize, searchText, filterStatus]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
      };

      if (searchText) {
        params.search = searchText;
      }

      // Use appropriate endpoint based on filter
      let endpoint = '/projects';
      if (filterStatus === 'active') endpoint = '/projects/active';
      else if (filterStatus === 'completed') endpoint = '/projects/completed';
      else if (filterStatus === 'pending') endpoint = '/projects/pending';

      const response = await axiosInstance.get(endpoint, { params });
      console.log('Projects response:', response);

      if (response.data || response) {
        const data = response.data || response;
        setProjects(Array.isArray(data) ? data : []);
        setPagination({
          ...pagination,
          total: response.total || (Array.isArray(data) ? data.length : 0),
        });
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      message.error('Failed to load projects');
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

  const showViewModal = (project) => {
    setSelectedProject(project);
    setIsViewModalVisible(true);
  };

  const showEditModal = (project) => {
    setSelectedProject(project);
    form.setFieldsValue({
      title: project.title,
      description: project.description,
      location: project.location,
      budget: project.budget,
      status: project.status,
      deadline: project.deadline ? moment(project.deadline) : null,
    });
    setIsModalVisible(true);
  };

  const showDeleteModal = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalVisible(true);
  };

  const handleOk = async () => {
  try {
    const values = await form.validateFields();
    setLoading(true);

    const projectData = {
      ...values,
      budget: Number(values.budget), // important
      deadline: values.deadline ? values.deadline.toISOString() : null,
      client: localStorage.getItem("userId"), // OR from auth context
    };

    if (selectedProject) {
      await axiosInstance.put(
        `/projects/${selectedProject._id}`,
        projectData
      );
      message.success("Project updated successfully");
    } else {
      await axiosInstance.post("/projects", projectData);
      message.success("Project created successfully");
    }

    setIsModalVisible(false);
    form.resetFields();
    setSelectedProject(null);
    fetchProjects();

  } catch (error) {
  console.log("FULL ERROR:", error);
  console.log("RESPONSE:", error.response?.data);
  message.error(error.response?.data?.message || "Failed to save project");
}

};


  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/projects/${projectToDelete._id}`);
      message.success('Project deleted successfully');
      
      setIsDeleteModalVisible(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      message.error('Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      setLoading(true);
      await axiosInstance.patch(`/projects/${projectId}/status`, { status: newStatus });
      message.success('Project status updated');
      fetchProjects();
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsViewModalVisible(false);
    setIsDeleteModalVisible(false);
    form.resetFields();
    setSelectedProject(null);
    setProjectToDelete(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "orange",
      active: "blue",
      completed: "green",
      cancelled: "red",
    };
    return colors[status?.toLowerCase()] || "default";
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: true,
    },
    {
      title: "Client",
      dataIndex: ["client", "name"],
      key: "client",
      render: (text, record) => record.client?.name || 'N/A',
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text) => text || 'N/A',
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      render: (budget) => budget ? `$${budget.toLocaleString()}` : 'N/A',
      sorter: (a, b) => (a.budget || 0) - (b.budget || 0),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record._id, value)}
          style={{ width: 120 }}
        >
          <Option value="pending">
            <Tag color="orange">Pending</Tag>
          </Option>
          <Option value="active">
            <Tag color="blue">Active</Tag>
          </Option>
          <Option value="completed">
            <Tag color="green">Completed</Tag>
          </Option>
          <Option value="cancelled">
            <Tag color="red">Cancelled</Tag>
          </Option>
        </Select>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
      sorter: (a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0),
    },
    {
      title: "Created",
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
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>All Projects</h2>
        <p>Manage and view all construction projects</p>
      </div>

      <div style={{ marginBottom: "16px", display: "flex", gap: "16px" }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search projects..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "300px" }}
        />
        
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 150 }}
        >
          <Option value="all">All Projects</Option>
          <Option value="pending">Pending</Option>
          <Option value="active">Active</Option>
          <Option value="completed">Completed</Option>
        </Select>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setSelectedProject(null);
            setIsModalVisible(true);
          }}
        >
          Add New Project
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={projects}
          rowKey={(record) => record._id}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} projects`,
          }}
          onChange={handleTableChange}
        />
      </Spin>

      {/* Add/Edit Project Modal */}
      <Modal
        title={selectedProject ? "Edit Project" : "Add New Project"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Project Title"
            rules={[{ required: true, message: "Please enter project title" }]}
          >
            <Input placeholder="Enter project title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Enter project description" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
          >
            <Input placeholder="Enter project location" />
          </Form.Item>

          <Form.Item
            name="budget"
            label="Budget"
            rules={[{ required: true, message: "Please enter budget" }]}
          >
            <Input type="number" prefix="$" placeholder="Enter budget" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Option value="pending">Pending</Option>
              <Option value="active">Active</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Deadline"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Project Modal */}
      <Modal
        title="Project Details"
        open={isViewModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedProject && (
          <div>
            <p><strong>Title:</strong> {selectedProject.title}</p>
            <p><strong>Description:</strong> {selectedProject.description}</p>
            <p><strong>Client:</strong> {selectedProject.client?.name || 'N/A'}</p>
            <p><strong>Location:</strong> {selectedProject.location || 'N/A'}</p>
            <p><strong>Budget:</strong> ${selectedProject.budget?.toLocaleString() || 'N/A'}</p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color={getStatusColor(selectedProject.status)}>
                {selectedProject.status?.toUpperCase()}
              </Tag>
            </p>
            <p><strong>Deadline:</strong> {selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Created:</strong> {new Date(selectedProject.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Project"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={loading}
      >
        <p>
          Are you sure you want to delete <strong>{projectToDelete?.title}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default AllProjects;

import { useState, useEffect } from "react";
import { Table, Button, Modal, Tag, message, Spin, Space, Input } from "antd";
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import axiosInstance from "../../../../api/axiosInstance";

const VerificationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/verification/requests');
      console.log('Verification requests response:', response);

      if (response.data || response) {
        const data = response.data || response;
        setRequests(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      message.error('Failed to load verification requests');
    } finally {
      setLoading(false);
    }
  };

  const showViewModal = (request) => {
    setSelectedRequest(request);
    setIsViewModalVisible(true);
  };

  const handleApprove = async (userId) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/verification/${userId}/approve`);
      message.success('User verified successfully');
      fetchVerificationRequests();
    } catch (error) {
      console.error('Error approving user:', error);
      message.error('Failed to approve user');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (userId) => {
    Modal.confirm({
      title: 'Reject Verification',
      content: 'Are you sure you want to reject this verification request?',
      okText: 'Reject',
      okType: 'danger',
      onOk: async () => {
        try {
          setLoading(true);
          await axiosInstance.post(`/verification/${userId}/reject`);
          message.success('Verification rejected');
          fetchVerificationRequests();
        } catch (error) {
          console.error('Error rejecting user:', error);
          message.error('Failed to reject verification');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleCancel = () => {
    setIsViewModalVisible(false);
    setSelectedRequest(null);
  };

  const getRoleColor = (role) => {
    const colors = {
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
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      dataIndex: "verificationStatus",
      key: "verificationStatus",
      render: (status) => (
        <Tag color={status === 'pending' ? 'orange' : status === 'approved' ? 'green' : 'red'}>
          {status?.toUpperCase() || 'PENDING'}
        </Tag>
      ),
    },
    {
      title: "Documents",
      dataIndex: "verificationDocuments",
      key: "verificationDocuments",
      render: (docs) => (
        <span>{docs?.length || 0} file(s)</span>
      ),
    },
    {
      title: "Request Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
          {record.verificationStatus === 'pending' && (
            <>
              <Button
                type="link"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record._id)}
                style={{ color: '#52c41a' }}
              >
                Approve
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(record._id)}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const filteredData = requests.filter(
    (request) =>
      request.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      request.role?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>Verification Requests</h2>
        <p>Manage pending user verification requests</p>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by name, email, or role..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "300px" }}
        />
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey={(record) => record._id}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} requests`,
          }}
        />
      </Spin>

      {/* View Details Modal */}
      <Modal
        title="Verification Request Details"
        open={isViewModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
          selectedRequest?.verificationStatus === 'pending' && (
            <Button
              key="approve"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                handleApprove(selectedRequest._id);
                handleCancel();
              }}
            >
              Approve
            </Button>
          ),
          selectedRequest?.verificationStatus === 'pending' && (
            <Button
              key="reject"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => {
                handleReject(selectedRequest._id);
                handleCancel();
              }}
            >
              Reject
            </Button>
          ),
        ]}
        width={600}
      >
        {selectedRequest && (
          <div>
            <p><strong>Name:</strong> {selectedRequest.name}</p>
            <p><strong>Email:</strong> {selectedRequest.email}</p>
            <p><strong>Phone:</strong> {selectedRequest.phone || 'N/A'}</p>
            <p>
              <strong>Role:</strong>{" "}
              <Tag color={getRoleColor(selectedRequest.role)}>
                {selectedRequest.role?.toUpperCase()}
              </Tag>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color={
                selectedRequest.verificationStatus === 'pending' ? 'orange' : 
                selectedRequest.verificationStatus === 'approved' ? 'green' : 'red'
              }>
                {selectedRequest.verificationStatus?.toUpperCase()}
              </Tag>
            </p>
            <p><strong>Request Date:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
            
            {selectedRequest.verificationDocuments && selectedRequest.verificationDocuments.length > 0 && (
              <div>
                <p><strong>Documents:</strong></p>
                <ul>
                  {selectedRequest.verificationDocuments.map((doc, index) => (
                    <li key={index}>
                      <a href={doc} target="_blank" rel="noopener noreferrer">
                        Document {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VerificationRequests;

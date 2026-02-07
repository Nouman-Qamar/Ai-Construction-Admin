import { useState, useEffect } from "react";
import { Table, Button, Modal, Tag, message, Spin, Space, Input, Form } from "antd";
import { EyeOutlined, LockOutlined, UnlockOutlined, SearchOutlined } from "@ant-design/icons";
import axiosInstance from "../../../../api/axiosInstance";

const { TextArea } = Input;

const SuspendedAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isSuspendModalVisible, setIsSuspendModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountToSuspend, setAccountToSuspend] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSuspendedAccounts();
  }, []);

  const fetchSuspendedAccounts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/suspension/accounts');
      console.log('Suspended accounts response:', response);

      if (response.data || response) {
        const data = response.data || response;
        setAccounts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching suspended accounts:', error);
      message.error('Failed to load suspended accounts');
    } finally {
      setLoading(false);
    }
  };

  const showViewModal = (account) => {
    setSelectedAccount(account);
    setIsViewModalVisible(true);
  };

  const showSuspendModal = (account) => {
    setAccountToSuspend(account);
    setIsSuspendModalVisible(true);
  };

  const handleSuspend = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await axiosInstance.post(`/suspension/${accountToSuspend._id}/suspend`, {
        reason: values.reason,
      });
      
      message.success('Account suspended successfully');
      setIsSuspendModalVisible(false);
      form.resetFields();
      setAccountToSuspend(null);
      fetchSuspendedAccounts();
    } catch (error) {
      console.error('Error suspending account:', error);
      message.error('Failed to suspend account');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsuspend = async (userId) => {
    Modal.confirm({
      title: 'Unsuspend Account',
      content: 'Are you sure you want to unsuspend this account?',
      okText: 'Unsuspend',
      okType: 'primary',
      onOk: async () => {
        try {
          setLoading(true);
          await axiosInstance.post(`/suspension/${userId}/unsuspend`);
          message.success('Account unsuspended successfully');
          fetchSuspendedAccounts();
        } catch (error) {
          console.error('Error unsuspending account:', error);
          message.error('Failed to unsuspend account');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleCancel = () => {
    setIsViewModalVisible(false);
    setIsSuspendModalVisible(false);
    form.resetFields();
    setSelectedAccount(null);
    setAccountToSuspend(null);
  };

  const getRoleColor = (role) => {
    const colors = {
      client: "volcano",
      contractor: "blue",
      laborer: "green",
      user: "cyan",
      admin: "purple",
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
      dataIndex: "suspended",
      key: "suspended",
      render: (suspended) => (
        <Tag color={suspended ? "red" : "green"}>
          {suspended ? "SUSPENDED" : "ACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Suspended Date",
      dataIndex: "suspendedAt",
      key: "suspendedAt",
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
      sorter: (a, b) => new Date(a.suspendedAt || 0) - new Date(b.suspendedAt || 0),
    },
    {
      title: "Reason",
      dataIndex: "suspensionReason",
      key: "suspensionReason",
      render: (reason) => reason || 'N/A',
      ellipsis: true,
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
          {record.suspended ? (
            <Button
              type="link"
              icon={<UnlockOutlined />}
              onClick={() => handleUnsuspend(record._id)}
              style={{ color: '#52c41a' }}
            >
              Unsuspend
            </Button>
          ) : (
            <Button
              type="link"
              danger
              icon={<LockOutlined />}
              onClick={() => showSuspendModal(record)}
            >
              Suspend
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const filteredData = accounts.filter(
    (account) =>
      account.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      account.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      account.role?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>Suspended Accounts</h2>
        <p>Manage suspended user accounts</p>
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
              `${range[0]}-${range[1]} of ${total} accounts`,
          }}
        />
      </Spin>

      {/* View Details Modal */}
      <Modal
        title="Account Details"
        open={isViewModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
          selectedAccount?.suspended ? (
            <Button
              key="unsuspend"
              type="primary"
              icon={<UnlockOutlined />}
              onClick={() => {
                handleUnsuspend(selectedAccount._id);
                handleCancel();
              }}
            >
              Unsuspend
            </Button>
          ) : (
            <Button
              key="suspend"
              danger
              icon={<LockOutlined />}
              onClick={() => {
                handleCancel();
                showSuspendModal(selectedAccount);
              }}
            >
              Suspend
            </Button>
          ),
        ]}
        width={600}
      >
        {selectedAccount && (
          <div>
            <p><strong>Name:</strong> {selectedAccount.name}</p>
            <p><strong>Email:</strong> {selectedAccount.email}</p>
            <p><strong>Phone:</strong> {selectedAccount.phone || 'N/A'}</p>
            <p>
              <strong>Role:</strong>{" "}
              <Tag color={getRoleColor(selectedAccount.role)}>
                {selectedAccount.role?.toUpperCase()}
              </Tag>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color={selectedAccount.suspended ? "red" : "green"}>
                {selectedAccount.suspended ? "SUSPENDED" : "ACTIVE"}
              </Tag>
            </p>
            {selectedAccount.suspended && (
              <>
                <p><strong>Suspended Date:</strong> {new Date(selectedAccount.suspendedAt).toLocaleString()}</p>
                <p><strong>Reason:</strong> {selectedAccount.suspensionReason || 'No reason provided'}</p>
              </>
            )}
            <p><strong>Join Date:</strong> {new Date(selectedAccount.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </Modal>

      {/* Suspend Account Modal */}
      <Modal
        title="Suspend Account"
        open={isSuspendModalVisible}
        onOk={handleSuspend}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <p>You are about to suspend: <strong>{accountToSuspend?.name}</strong></p>
        <Form form={form} layout="vertical">
          <Form.Item
            name="reason"
            label="Reason for Suspension"
            rules={[{ required: true, message: "Please provide a reason" }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter the reason for suspending this account..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SuspendedAccounts;

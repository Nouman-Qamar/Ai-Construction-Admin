import { useState, useEffect } from "react";
import { Card, Form, Input, Button, message, Spin, Avatar, Upload, Row, Col } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, SaveOutlined, CameraOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Get current user profile from localStorage or API
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setProfileData(userData);
        form.setFieldsValue({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      message.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Update profile via API
      const response = await axiosInstance.put(`/users/${profileData._id}`, values);
      
      // Update local storage and context
      const updatedUser = { ...profileData, ...values };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      updateUser(updatedUser);
      setProfileData(updatedUser);
      
      message.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue({
      name: profileData?.name,
      email: profileData?.email,
      phone: profileData?.phone,
    });
    setEditing(false);
  };

  const handleAvatarUpload = async (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Handle successful upload
      message.success('Profile picture updated');
      setLoading(false);
    }
    if (info.file.status === 'error') {
      message.error('Failed to upload profile picture');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "24px" }}>Admin Profile</h2>

      <Spin spinning={loading}>
        <Row gutter={24}>
          {/* Profile Picture Card */}
          <Col xs={24} md={8}>
            <Card>
              <div style={{ textAlign: "center" }}>
                <Avatar
                  size={150}
                  icon={<UserOutlined />}
                  src={profileData?.profilePicture}
                  style={{ marginBottom: "16px" }}
                />
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  onChange={handleAvatarUpload}
                  customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                >
                  <Button icon={<CameraOutlined />} block>
                    Change Photo
                  </Button>
                </Upload>
                
                <div style={{ marginTop: "24px", textAlign: "left" }}>
                  <p><strong>Role:</strong> <span style={{ color: "#722ed1" }}>ADMIN</span></p>
                  <p><strong>Status:</strong> <span style={{ color: "#52c41a" }}>Active</span></p>
                  <p><strong>Member Since:</strong> {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </Card>
          </Col>

          {/* Profile Information Card */}
          <Col xs={24} md={16}>
            <Card
              title="Profile Information"
              extra={
                !editing ? (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : null
              }
            >
              <Form
                form={form}
                layout="vertical"
                disabled={!editing}
              >
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: "Please enter your name" }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your name"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Invalid email format" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Enter your email"
                    size="large"
                    disabled // Email typically can't be changed
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Enter your phone number"
                    size="large"
                  />
                </Form.Item>

                {editing && (
                  <Form.Item>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        loading={loading}
                        block
                      >
                        Save Changes
                      </Button>
                      <Button onClick={handleCancel} block>
                        Cancel
                      </Button>
                    </div>
                  </Form.Item>
                )}
              </Form>
            </Card>

            {/* Change Password Card */}
            <Card
              title="Change Password"
              style={{ marginTop: "24px" }}
            >
              <Form layout="vertical">
                <Form.Item
                  name="currentPassword"
                  label="Current Password"
                  rules={[{ required: true, message: "Please enter current password" }]}
                >
                  <Input.Password
                    placeholder="Enter current password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[
                    { required: true, message: "Please enter new password" },
                    { min: 8, message: "Password must be at least 8 characters" },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter new password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm New Password"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: "Please confirm new password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Confirm new password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block size="large">
                    Update Password
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Profile;

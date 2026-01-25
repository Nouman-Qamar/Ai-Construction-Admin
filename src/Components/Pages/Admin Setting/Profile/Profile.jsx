import { useState } from "react";
import {
  Card,
  Button,
  Input,
  Avatar,
  Upload,
  Form,
  message,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  LogoutOutlined,
  CameraOutlined,
} from "@ant-design/icons";

import "./profile.css";

export function Profile() {
  
  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@construction.com",
    phone: "+1 (555) 123-4567",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  });

  const [form] = Form.useForm();

  
  form.setFieldsValue(profile);

 
  const handleSaveProfile = (values) => {
    setProfile({ ...profile, ...values });
    message.success("Profile updated (locally)");
  };

  
  const handleChangePassword = (values) => {
    if (values.newPassword !== values.confirmNewPassword) {
      return message.error("New passwords do not match");
    }

    message.success("Password updated (locally)");
  };

  
  const uploadProps = {
    beforeUpload: (file) => {
      const url = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, photo: url }));
      message.success("Profile photo updated (locally)");
      return false; 
    },
  };

  
  const logoutAllDevices = () => {
    message.success("Logged out (simulated)");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-sections">
        {/* Profile Picture */}
        <Card title="Profile Picture" className="profile-card">
          <div className="profile-picture-section">
            <div className="profile-avatar-wrapper">
              <Avatar size={100} src={profile.photo} icon={<UserOutlined />} />
              <Button
                shape="circle"
                icon={<CameraOutlined />}
                className="profile-camera-btn"
              />
            </div>

            <div>
              <p className="text-title">Update your photo</p>
              <p className="text-sub">JPG, PNG or GIF. Max size 2MB.</p>

              <Upload {...uploadProps} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Upload Photo</Button>
              </Upload>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card title="Personal Information" className="profile-card">
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSaveProfile}
            initialValues={profile}
          >
            <div className="two-columns">
              <Form.Item name="firstName" label="First Name">
                <Input />
              </Form.Item>
              <Form.Item name="lastName" label="Last Name">
                <Input />
              </Form.Item>
            </div>

            <Form.Item name="email" label="Email Address">
              <Input />
            </Form.Item>

            <Form.Item name="phone" label="Phone Number">
              <Input />
            </Form.Item>

            <div className="align-right">
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Card>

        {/* Change Password */}
        <Card title="Change Password" className="profile-card">
          <Form layout="vertical" onFinish={handleChangePassword}>
            <Form.Item name="currentPassword" label="Current Password">
              <Input.Password placeholder="Enter current password" />
            </Form.Item>

            <Form.Item name="newPassword" label="New Password">
              <Input.Password placeholder="Enter new password" />
            </Form.Item>

            <Form.Item name="confirmNewPassword" label="Confirm New Password">
              <Input.Password placeholder="Confirm new password" />
            </Form.Item>

            <div className="align-right">
              <Button type="primary" htmlType="submit">
                Update Password
              </Button>
            </div>
          </Form>
        </Card>

        {/* Danger Zone */}
        <Card title="Danger Zone" className="profile-card danger-card">
          <div className="danger-zone-flex">
            <div>
              <p className="text-title">Logout from all devices</p>
              <p className="text-sub">This will sign you out from all sessions</p>
            </div>

            <Button danger icon={<LogoutOutlined />} onClick={logoutAllDevices}>
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Profile;

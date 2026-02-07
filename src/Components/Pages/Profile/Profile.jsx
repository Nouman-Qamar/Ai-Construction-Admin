import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Input,
  Avatar,
  Upload,
  Form,
  message,
  Spin,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  LogoutOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import authService from "../../../Services/authService";
import "./profile.css";

export function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Fetch profile data from backend
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await authService.getProfile();
      const userData = response.data;
      setProfile({
        firstName: userData.name.split(" ")[0] || "",
        lastName: userData.name.split(" ")[1] || "",
        email: userData.email || "",
        phone: userData.phone || "",
        photo: userData.profilePicture || "https://images.unplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      });
      form.setFieldsValue({
        firstName: userData.name.split(" ")[0] || "",
        lastName: userData.name.split(" ")[1] || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      message.error("Failed to load profile data");
      // Fallback to default data
      const defaultProfile = {
        firstName: "Admin",
        lastName: "User",
        email: "admin@construction.com",
        phone: "+1 (555) 123-4567",
        photo: "https://images.unplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
      };
      setProfile(defaultProfile);
      form.setFieldsValue(defaultProfile);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (values) => {
    setUpdating(true);
    try {
      const fullName = `${values.firstName} ${values.lastName}`.trim();
      await authService.updateProfile({
        name: fullName,
        email: values.email,
        phone: values.phone,
      });
      setProfile({ ...profile, ...values });
      message.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmNewPassword) {
      return message.error("New passwords do not match");
    }
    setUpdating(true);
    try {
      await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success("Password updated successfully");
      passwordForm.resetFields();
    } catch (error) {
      console.error("Error changing password:", error);
      message.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setUpdating(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
        return false;
      }
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, photo: url }));
      message.success("Profile photo updated (preview only - backend upload to be implemented)");
      // TODO: Implement actual file upload to backend
      return false;
    },
  };

  const logoutAllDevices = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <Spin size="large" />
      </div>
    );
  }

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
              <Avatar size={100} src={profile?.photo} icon={<UserOutlined />} />
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
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="phone" label="Phone Number">
              <Input />
            </Form.Item>

            <div className="align-right">
              <Button type="primary" htmlType="submit" loading={updating}>
                Save Changes
              </Button>
            </div>
          </Form>
        </Card>

        {/* Change Password */}
        <Card title="Change Password" className="profile-card">
          <Form layout="vertical" form={passwordForm} onFinish={handleChangePassword}>
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: "Please enter current password" }]}
            >
              <Input.Password placeholder="Enter current password" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please enter new password" },
                { min: 8, message: "Password must be at least 8 characters" }
              ]}
            >
              <Input.Password placeholder="Enter new password" />
            </Form.Item>

            <Form.Item
              name="confirmNewPassword"
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
              <Input.Password placeholder="Confirm new password" />
            </Form.Item>

            <div className="align-right">
              <Button type="primary" htmlType="submit" loading={updating}>
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
            <Button 
              danger 
              icon={<LogoutOutlined />} 
              onClick={logoutAllDevices}
            >
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Profile;

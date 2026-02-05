import { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('📝 Attempting login with:', { email: values.email });
      const response = await loginUser({
        email: values.email,
        password: values.password,
      });

      console.log('📥 Login response:', response);

      if (response && response.success) {
        console.log('✅ Login successful, user:', response.user);
        console.log('🔑 Token received:', response.token ? 'Yes' : 'No');
        
        // Check if user is admin BEFORE calling login
        if (response.user.role !== 'admin') {
          message.error('Access denied. Admin privileges required.');
          console.error('❌ User role is not admin:', response.user.role);
          setLoading(false);
          return;
        }
        
        // Store in localStorage first
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('💾 Stored in localStorage');
        
        // Use AuthContext login function to set state
        const isLoginSuccessful = login(response.user, response.token);
        console.log('🔐 AuthContext login result:', isLoginSuccessful);

        if (isLoginSuccessful) {
          message.success("Login successful! Redirecting...");
          console.log('🚀 Will navigate in 800ms...');
          
          // Longer delay to ensure state is fully updated
          setTimeout(() => {
            console.log('➡️ Navigating now with window.location');
            // Use window.location to force a complete page reload
            // This ensures the ProtectedRoute gets fresh state
            window.location.href = '/';
          }, 800);
        } else {
          console.error('❌ Login function returned false');
          message.error('Login failed. Please try again.');
        }
      } else {
        console.error('❌ Login unsuccessful. Response:', response);
        message.error(response?.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      
      const errorMessage =
        error?.response?.data?.message ||
        error?.message || 
        "Login failed. Please check your credentials.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <div className="login-header">
          <Title level={2}>Admin Login</Title>
          <Text type="secondary">AI Construction Management System</Text>
        </div>

        <Form
          name="login"
          initialValues={{ 
            email: 'admin@aiconst.com', // Pre-filled for testing
            remember: true 
          }}
          onFinish={onFinish}
          size="large"
          className="login-form"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              loading={loading}
              block
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
            <strong>Test Credentials:</strong>
          </Text>
          <Text type="secondary" style={{ fontSize: '13px', display: 'block' }}>
            Email: admin@aiconst.com
          </Text>
          <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '12px' }}>
            Password: Admin@123456
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Forgot your password? Contact system administrator.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;

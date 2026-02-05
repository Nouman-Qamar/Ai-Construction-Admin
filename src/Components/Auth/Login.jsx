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

      if (response.success) {
        console.log('✅ Login successful, user:', response.user);
        
        // Store in localStorage first so AuthContext can read it
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('💾 Stored in localStorage');
        
        // Use AuthContext login function to properly set auth state
        const isLoginSuccessful = login(response.user, response.token);
        console.log('🔐 AuthContext login result:', isLoginSuccessful);

        if (isLoginSuccessful) {
          message.success("Login successful! Redirecting...");
          console.log('🚀 Navigating to home page...');
          
          // Small delay to ensure state updates complete
          setTimeout(() => {
            console.log('➡️ Executing navigate("/")');
            navigate("/", { replace: true });
          }, 100);
        }
      } else {
        console.error('❌ Login unsuccessful:', response);
        message.error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage =
        error?.message || "Login failed. Please check your credentials.";
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
          initialValues={{ remember: true }}
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
          <Text type="secondary">
            Forgot your password? Contact system administrator.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;

import { Button, Tag, Space, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

export const getColumns = ({ getStatusColor, showViewModal, showEditModal, handleDelete }) => [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <strong>{text}</strong>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (text) => <Tag color="blue">{text}</Tag>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => <Tag color={getStatusColor(text)}>{text}</Tag>,
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Join Date",
    dataIndex: "joinDate",
    key: "joinDate",
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => {
      console.log("Record in actions column:", record);
      return (
        <Space size="middle">
          <Tooltip title="View">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => showViewModal(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => {
                console.log("Delete button clicked, record:", record, "id:", record.id);
                if (record && record.id) {
                  handleDelete(record.id);
                } else {
                  console.error("Record or record.id is missing:", record);
                }
              }}
            />
          </Tooltip>
        </Space>
      );
    },
  },
];

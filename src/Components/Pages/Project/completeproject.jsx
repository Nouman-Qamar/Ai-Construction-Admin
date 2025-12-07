import React, { useState, useEffect } from "react";
import { Table, Spin, Typography } from "antd";

const { Title } = Typography;

const CompleteProject = () => {
const [loading, setLoading] = useState(true);
const [projects, setProjects] = useState([]);

useEffect(() => {
const dummyData = [
{ id: 1, name: "City Tower Construction", client: "Alpha Developers", completionDate: "2024-10-12", status: "Complete" },
{ id: 2, name: "Mall Renovation Project", client: "Urban Group", completionDate: "2024-09-20", status: "Complete" },
{ id: 3, name: "Highway Extension", client: "Govt Contract", completionDate: "2024-07-15", status: "Complete" },
];


setTimeout(() => {
  setProjects(dummyData);
  setLoading(false);
}, 600);


}, []);

const columns = [
{ title: "Project Name", dataIndex: "name", key: "name" },
{ title: "Client", dataIndex: "client", key: "client" },
{ title: "Completion Date", dataIndex: "completionDate", key: "completionDate" },
{ title: "Status", dataIndex: "status", key: "status", render: (status) => <span style={{ color: "green", fontWeight: "bold" }}>{status}</span> },
];

return (
<div style={{ padding: 24 }}> <Title level={2}>Complete Projects</Title>
{loading ? <Spin /> : <Table columns={columns} dataSource={projects} rowKey="id" pagination={{ pageSize: 8 }} />} </div>
);
};

export default CompleteProject;

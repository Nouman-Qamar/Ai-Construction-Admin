import { useState } from "react";
import { Card, Typography, Button, Tag, Flex, Checkbox, Input } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const pendingProjects = [
  {
    id: 1,
    title: "Green Energy Plant",
    company: "EcoPower Solutions",
    location: "Denver, CO",
    budget: "$5,200,000",
    startDate: "2024-12-15",
    status: "Pending Review",
    image:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=400",
  },
  {
    id: 2,
    title: "University Dormitory",
    company: "State University",
    location: "Madison, WI",
    budget: "$2,800,000",
    startDate: "2025-01-10",
    status: "Pending Review",
    image:
      "https://images.unsplash.com/photo-1568495248636-6433b8b35d8c?q=80&w=400",
  },
];

export default function PendingApproval() {
  const [selectedProjects, setSelectedProjects] = useState([]);

  const handleSelect = (id) => {
    if (selectedProjects.includes(id)) {
      setSelectedProjects(selectedProjects.filter((pid) => pid !== id));
    } else {
      setSelectedProjects([...selectedProjects, id]);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography.Title level={3}>Pending Approval</Typography.Title>
      <Input.Search
        placeholder="Search projects..."
        allowClear
        style={{ width: 300, marginBottom: "1rem" }}
      />

      <div style={{ marginBottom: "1rem" }}>
        <Button type="default" style={{ marginRight: "0.5rem" }}>
          All Projects (11)
        </Button>
        <Button type="default" style={{ marginRight: "0.5rem" }}>
          Active (3)
        </Button>
        <Button type="default" style={{ marginRight: "0.5rem" }}>
          Bids (2)
        </Button>
        <Button type="default" style={{ marginRight: "0.5rem" }}>
          Completed (2)
        </Button>
        <Button type="default" style={{ marginRight: "0.5rem" }}>
          Cancelled (2)
        </Button>
        <Button type="default" style={{ marginRight: "0.5rem" }}>
          Pending Approval (2)
       <Route path="/pending-approval" element={<PendingApproval />} /> 

        </Button>
      </div>

      <Checkbox
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedProjects(pendingProjects.map((p) => p.id));
          } else {
            setSelectedProjects([]);
          }
        }}
      >
        Select all {pendingProjects.length} projects
      </Checkbox>

      {pendingProjects.map((project) => (
        <Card
          key={project.id}
          style={{ marginTop: "1rem" }}
        >
          <Flex align="center" gap="1rem">
            <Checkbox
              checked={selectedProjects.includes(project.id)}
              onChange={() => handleSelect(project.id)}
            />

            <img
              src={project.image}
              alt={project.title}
              style={{
                width: 55,
                height: 55,
                borderRadius: 10,
                objectFit: "cover",
              }}
            />

            <div style={{ flex: 1 }}>
              <Typography.Text strong style={{ fontSize: 16 }}>
                {project.title}
              </Typography.Text>
              <Tag color="gold">{project.status}</Tag>
              <div style={{ marginTop: 4 }}>
                <Typography.Text type="secondary">{project.company}</Typography.Text>
                <div style={{ marginTop: 2 }}>
                  📍 {project.location} | Start: {project.startDate} | Budget: {project.budget}
                </div>
              </div>
            </div>

            <Button icon={<EyeOutlined />} style={{ marginRight: "0.5rem" }}>
              Review
            </Button>
            <Button type="primary" style={{ backgroundColor: "#28a745", borderColor: "#28a745", marginRight: "0.5rem" }}>
              Approve
            </Button>
            <Button type="primary" danger>
              Reject
            </Button>
          </Flex>
        </Card>
      ))}
    </div>
  );
}


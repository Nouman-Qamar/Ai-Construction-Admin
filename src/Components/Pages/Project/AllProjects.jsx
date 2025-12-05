import { useState } from "react";
import { Input, Tag, Button, Flex, Typography, Select, Card } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const projectData = [
  {
    id: 1,
    title: "Downtown Office Complex",
    company: "Tech Corp Inc.",
    status: "Active",
    type: "Commercial",
    location: "New York, NY",
    budget: "$2,500,000",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400",


  },
];




export default function AllProjects() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filterButtons = [
    "All Projects (11)",
    "Active (3)",
    "Bids (2)",
    "Completed (2)",
    "Cancelled (2)",
    "Pending Approval (2)",
  ];

  return (
    <div style={{ padding: "1.5rem 2rem" }}>
      <Typography.Title level={3}>All Projects</Typography.Title>
      <Typography.Text type="secondary">
        Manage and monitor all construction projects
      </Typography.Text>

      {/* Search + Category Filter Box */}
      <Card style={{ marginTop: "1.5rem" }}>
        <Flex vertical gap="1rem">
          <Input.Search
            placeholder="Search projects..."
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />

          <Select
            defaultValue="All Categories"
            style={{ width: 250 }}
            onChange={setCategory}
            options={[
              { value: "All", label: "All Categories" },
              { value: "Commercial", label: "Commercial" },
              { value: "Residential", label: "Residential" },
            ]}
          />
        </Flex>
      </Card>

      {/* Filter Tabs */}
      <Flex gap="1rem" style={{ marginTop: "1rem", flexWrap: "wrap" }}>
        {filterButtons.map((text) => (
          <Button key={text} type="default">
            {text}
          </Button>
        ))}
      </Flex>

      {/* Project Card List */}
      <Card style={{ marginTop: "1.5rem" }}>
        <Flex align="center" gap="1rem">
          <input type="checkbox" />

          <img
            src={projectData[0].image}
            alt="Project"
            style={{
              width: 55,
              height: 55,
              borderRadius: 10,
              objectFit: "cover",
            }}
          />

          <Flex vertical style={{ flex: 1 }}>
            <Typography.Text strong style={{ fontSize: 16 }}>
              {projectData[0].title}
            </Typography.Text>

            <Typography.Text type="secondary">
              {projectData[0].company}
            </Typography.Text>

            <Flex gap="1rem" style={{ marginTop: 4 }}>
              <Flex align="center" gap="0.3rem">
                📍
                <Typography.Text type="secondary">
                  {projectData[0].location}
                </Typography.Text>
              </Flex>

              <Typography.Text strong>{projectData[0].budget}</Typography.Text>
            </Flex>
          </Flex>

          <Tag color="green">{projectData[0].status}</Tag>
          <Tag>{projectData[0].type}</Tag>

          <Button type="primary" icon={<EyeOutlined />}>
            View Details
          </Button>
        </Flex>
      </Card>
    </div>
  );
}

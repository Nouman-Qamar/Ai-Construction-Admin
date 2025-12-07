import { Button, Tag } from "antd";

export function allcolumns({ handleDelete, getRoleColor }) {

    return (
        [
            {
                title: 'User',
                dataIndex: 'user',
                key: 'name',
                width: "20%",
            },
            {
                title: 'Role',
                dataIndex: 'role',
                render: (role) => <Tag color={getRoleColor(role)}>{role}</Tag>,
                width: "20%",
            },
            {
                title: 'Submitted',
                dataIndex: 'submitted',
                key: 'address',
                width: "20%",
            },
            {
                title: 'Document',
                dataIndex: 'document',
                render: (document) => <Tag color="#aeacacff" >{document}</Tag>,
                key: 'age',
                width: "20%",
            },
            {
                title: 'Action',
                dataIndex: 'action',
                width: "20%",
                render: (_, record) => (
                    <div style={{ gap: "10px", display: "flex" }} >
                        <Button  >Review</Button>
                        <Button type="primary" style={{ background: "green", }} >Approve</Button>
                        <Button type="primary" style={{ background: "red" }} onClick={() => handleDelete(record.key)}>Reject</Button>
                    </div>

                )
            },

        ]
    )
};
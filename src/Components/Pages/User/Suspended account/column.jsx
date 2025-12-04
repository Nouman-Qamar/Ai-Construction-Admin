import { Button, Tag } from "antd";
import { BsJustify } from "react-icons/bs";
export const allcolumns = (detail) => {
    const getRoleColor = (role) => {
        if (role === "Contractor") {
            return "blue";
        } else if (role === "Labor") {
            return "green";
        }
        else {
            return "red";
        }
    };
    return (
        [
            {
                title: 'User',
                dataIndex: 'user',
                key: 'name',
                width: "30%",
            },
            {
                title: 'Role',
                dataIndex: 'role',
                render: (role) => <Tag color={getRoleColor(role)}>{role}</Tag>,
                key: 'age',
                width: "10%",
            },
            {
                title: 'Suspended Date',
                dataIndex: 'suspendeddate',
                key: 'address',
                width: "20%",
            },
            {
                title: 'Reason',
                dataIndex: 'reason',
                render: (reason) => <Tag color="red">{reason}</Tag>,

                key: 'age',
                width: "10%",
            },
            {
                title: 'Acion',
                dataIndex: 'action',
                width: "30%",
                render: (_, record) => (
                    <div style={{ gap: "10px", display: "flex" }}>
                        <Button onClick={() => detail(record.key)}>View Detail</Button>

                        <Button type="primary">Restore</Button>
                    </div>

                )
            },

        ]
    )
};


import { Table, Modal, Button } from "antd";
import { dataSource } from "./constant";
import { allcolumns } from "./column";
import Search from "antd/es/transfer/search";
import { useState } from "react";



function Suspend() {
    const [visible, setvisible] = useState(true);
    const detail = () => {
        setvisible(!visible);
    }

    return (
        <div>
            <h1>Suspended Accounts</h1>
            <p>Manage and review suspended user accounts</p>
            <div style={{ padding: "20px", marginBottom: "20px", borderRadius: "10px", background: "white" }}>
                <Search placeholder="Search suspended users" />
            </div>
            <Table dataSource={dataSource} columns={allcolumns(detail)} />
            <Modal title="Suspended Account Details"
                width={1000}
                open={!visible}
                onCancel={() => setvisible(!visible)}
                onOk={() => setvisible(!visible)}
                footer={null}  >

                <Table dataSource={dataSource} columns={allcolumns()} />
            </Modal>
        </div>
    )
};
export default Suspend;
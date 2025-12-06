import { Table } from "antd";
import Search from "antd/es/transfer/search";
import { allcolumns } from "./column";
import { dataSource } from "./constant";
import { useState } from "react";


function Verification() {
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
  const getcolumndata = JSON.parse(localStorage.getItem("rejectdata"))
  const [column, setcolumn] = useState(dataSource);

  const handleDelete = (key) => {
    const result = column.filter((item) => item.key != key);
    setcolumn(result);
    localStorage.setItem("rejectdata", JSON.stringify(result));
  }
  return (
    <div>
      <div>
        <h1>Verification Request</h1>
        <p>Review and approve pending verification request</p>
        <div style={{ padding: "20px", marginBottom: "20px", borderRadius: "10px", background: "white" }}>
          <Search placeholder="Search suspended users" />
        </div>

        <Table dataSource={column} columns={allcolumns({ handleDelete, getRoleColor })} />

      </div>
    </div>
  )
};

export default Verification;
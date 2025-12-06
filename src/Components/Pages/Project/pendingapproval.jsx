import React, { useState } from "react";

const initialProjects = [
    { id: 1, name: "Project Alpha", owner: "John Doe", status: "Pending" },
    { id: 2, name: "Project Beta", owner: "Jane Smith", status: "Pending" },
];

const PendingApproval = () => {
    const [projects, setProjects] = useState(initialProjects);

    const handleEdit = (id) => {
        alert(`Edit project with ID: ${id}`);
        // Implement edit logic here
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            setProjects(projects.filter((project) => project.id !== id));
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Pending Project Approvals</h2>
            {projects.length === 0 ? (
                <p>No pending projects.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Owner</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Status</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.id}>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{project.name}</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{project.owner}</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{project.status}</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    <button onClick={() => handleEdit(project.id)} style={{ marginRight: "8px" }}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(project.id)} style={{ color: "red" }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PendingApproval;
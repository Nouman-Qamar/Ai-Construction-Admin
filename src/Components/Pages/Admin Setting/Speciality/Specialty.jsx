
import "./Specialty.css";

const Speciality = () => {
  return (
    <div className="speciality-page">
      
      <div className="speciality-header">
        <h1>Our Specialities</h1>
        <p>
          Clearly defined roles and responsibilities to ensure smooth and
          efficient construction management.
        </p>
      </div>
    
    <div className="speciality-details">
      <h2>Why Specialities Matter</h2>
      <p>
        Specialities in construction management help streamline processes,
        enhance communication, and ensure that each role is clearly defined.
        This leads to improved efficiency and accountability across all
        levels of the project.
      </p>
      <h3>Key Benefits:</h3>
      <ul>
        <li>Enhanced collaboration among team members</li>
        <li>Clear accountability for tasks and responsibilities</li>
        <li>Improved project outcomes through specialized focus</li>
        <li>Efficient resource allocation and management</li>
      </ul>
    </div>
    
      <div className="speciality-section">
   
        <div className="role-card">
          <div className="role-icon">🛡️</div>
          <h2>Admin</h2>
          <p className="role-description">
            The Admin oversees the entire system, ensuring security,
            performance, and proper role management.
          </p>
          <ul>
            <li>Manage users and roles</li>
            <li>Control system permissions</li>
            <li>Monitor activities and reports</li>
            <li>Maintain system configuration</li>
          </ul>
        </div>
        <div className="role-card">
          <div className="role-icon">🏗️</div>
          <h2>Contractor</h2>
          <p className="role-description">
            Contractors handle project execution, coordination, and task
            distribution.
          </p>
          <ul>
            <li>Create and manage projects</li>
            <li>Assign tasks to labour</li>
            <li>Track project progress</li>
            <li>Communicate with users and admin</li>
          </ul>
        </div>

        <div className="role-card">
          <div className="role-icon">👤</div>
          <h2>User</h2>
          <p className="role-description">
            Users can view project details, request services, and stay informed
            about work progress.
          </p>
          <ul>
            <li>View project updates</li>
            <li>Submit service requests</li>
            <li>Communicate with contractors</li>
            <li>Track work status</li>
          </ul>
        </div>

        <div className="role-card">
          <div className="role-icon">👷</div>
          <h2>Labour</h2>
          <p className="role-description">
            Labour performs on-site tasks and updates progress according to
            assigned work.
          </p>
          <ul>
            <li>Receive assigned tasks</li>
            <li>Update work progress</li>
            <li>Follow safety guidelines</li>
            <li>Report issues or delays</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Speciality;

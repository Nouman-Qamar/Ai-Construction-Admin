
import { useState } from "react";
import { Eye, Calendar, DollarSign } from "lucide-react";
import { cancelProjectsData } from "./cancelProjectsData";
import CancelReviewModal from "./CancelReviewModal";
import "./cancel-project.css";

export default function CancelProjects() {
  const [projects, setProjects] = useState(cancelProjectsData);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState(new Set());
  const [searchText, setSearchText] = useState("");

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedProjects(new Set(filteredProjects.map((p) => p.id)));
    } else {
      setSelectedProjects(new Set());
    }
  };

  const handleSelectProject = (id) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProjects(newSelected);
    setSelectAll(newSelected.size === filteredProjects.length);
  };

  const handleReview = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Filter projects based on search
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchText.toLowerCase()) ||
      project.project.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="cancel-overview-wrapper">
      <div className="cancel-header">
        <h2 className="cancel-title">Cancel Projects</h2>
      </div>

      {/* Search Bar */}
      <div className="cancel-search-section">
        <input
          type="text"
          placeholder="Search by contractor name or project..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="cancel-search-input"
        />
      </div>

      <div className="cancel-content">
        <label className="cancel-select-all">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="cancel-checkbox"
          />
          <span>Select all {filteredProjects.length} projects</span>
        </label>

        {filteredProjects.length === 0 ? (
          <div className="cancel-empty-state">
            <p>No projects found matching your search</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="cancel-card">
              <div className="cancel-card-left">
                <input
                  type="checkbox"
                  checked={selectedProjects.has(project.id)}
                  onChange={() => handleSelectProject(project.id)}
                  className="cancel-checkbox"
                />

                {/* Avatar */}
                <div className="cancel-avatar">
                  {project.name.charAt(0)}
                </div>

                {/* Details */}
                <div className="cancel-details">
                  <h3 className="cancel-name">{project.name}</h3>
                  <p className="cancel-project">{project.project}</p>

                  <div className="cancel-info">
                    <div className="cancel-info-item">
                      <DollarSign size={18} />
                      <span className="cancel-font-medium">{project.bid}</span>
                    </div>

                    <div className="cancel-info-item">
                      <Calendar size={18} />
                      <span className="cancel-font-medium">{project.timeline}</span>
                    </div>

                    <span className={`cancel-status cancel-status-${project.status.toLowerCase().replace(/ /g, "-")}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="cancel-actions">
                <button
                  className="cancel-btn cancel-btn-review"
                  onClick={() => handleReview(project)}
                >
                  <Eye size={18} />
                  Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <CancelReviewModal
        isOpen={isModalOpen}
        project={selectedProject}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
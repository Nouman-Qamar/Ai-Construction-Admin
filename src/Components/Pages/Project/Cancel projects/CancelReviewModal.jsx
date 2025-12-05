import { useState } from "react";
import { X, Edit2 } from "lucide-react";
import "./CancelReviewModal.css";

export default function CancelReviewModal({ isOpen, project, onClose }) {
  const [isEditMode, setIsEditMode] = useState(false);

  if (!isOpen || !project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Header */}

        <div className="modal-header">
          <div>
            <h2 className="modal-title">{project.project}</h2>
            <p className="modal-subtitle">Cancellation Review</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Body */}

        <div className="modal-body">

          {/* Contractor Info */}
          
          <div className="bid-section">
            <div className="bid-section-header">
              <div className="bid-contractor-info">
                <div className="bid-contractor-avatar">
                  {project.name.charAt(0)}
                </div>
                <div>
                  <h3 className="bid-contractor-name">{project.name}</h3>
                  <p className="bid-contractor-title">Contractor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bid-section">
            <h3 className="bid-section-title">Project Details</h3>
            <div className="bid-details-grid">
              <div className="bid-detail-item">
                <label className="bid-detail-label">Project Amount</label>
                <p className="bid-detail-value">{project.bid}</p>
              </div>
              <div className="bid-detail-item">
                <label className="bid-detail-label">Timeline</label>
                <p className="bid-detail-value">{project.timeline}</p>
              </div>
              <div className="bid-detail-item">
                <label className="bid-detail-label">Status</label>
                <p className={`bid-detail-value bid-status-${project.status.toLowerCase().replace(/ /g, "-")}`}>
                  {project.status}
                </p>
              </div>
              <div className="bid-detail-item">
                <label className="bid-detail-label">Cancellation Reason</label>
                <p className="bid-detail-value">{project.reason}</p>
              </div>
              <div className="bid-detail-item">
                <label className="bid-detail-label">Request Date</label>
                <p className="bid-detail-value">{project.requestDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="modal-btn modal-btn-primary" onClick={() => setIsEditMode(!isEditMode)}>
            <Edit2 size={16} />
            {isEditMode ? "Done" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
}

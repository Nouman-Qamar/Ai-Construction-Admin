
import { useState } from "react"
import { X, Edit2 } from "lucide-react"

export default function CancelReviewModal({ isOpen, project, onClose }) {
  
  const [isEditMode, setIsEditMode] = useState(false)

  
  if (isOpen === false || !project) {
    return null
  }

  
  const handleEditToggle = () => {
    if (isEditMode === true) {
      setIsEditMode(false)
    } else {
      setIsEditMode(true)
    }
  }

  
  let statusClass = ""
  if (project.status) {
    statusClass = project.status.toLowerCase().replace(/ /g, "-")
  }

  return (
    <div className="modal-overlay">
      <div className="bottom-sheet">

       
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{project.project}</h2>
            <p className="modal-subtitle">Cancellation Review</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

       
        <div className="modal-body">

          
          <div className="modal-section">
            <div className="contractor-row">
              <div className="contractor-avatar">
                {project.name.charAt(0)}
              </div>

              <div>
                <h3 className="contractor-name">{project.name}</h3>
                <p className="contractor-title">Contractor</p>
              </div>
            </div>
          </div>

          
          <div className="modal-section">
            <h3 className="section-title">Project Details</h3>

            <div className="details-grid">

              <div className="detail-item">
                <label>Amount</label>
                <p>{project.bid}</p>
              </div>

              <div className="detail-item">
                <label>Timeline</label>
                <p>{project.timeline}</p>
              </div>

              <div className="detail-item">
                <label>Status</label>
                <p className={`status-tag ${statusClass}`}>
                  {project.status}
                </p>
              </div>

              <div className="detail-item">
                <label>Reason</label>

                {isEditMode === true ? (
                  <textarea
                    className="modal-textarea"
                    defaultValue={project.reason}
                  ></textarea>
                ) : (
                  <p>{project.reason}</p>
                )}
              </div>

              <div className="detail-item">
                <label>Request Date</label>
                <p>{project.requestDate}</p>
              </div>

            </div>
          </div>

        </div>

        
        <div className="modal-footer">
          <button className="modal-btn cancel" onClick={onClose}>
            Close
          </button>

          <button className="modal-btn primary" onClick={handleEditToggle}>
            <Edit2 size={16} />
            {isEditMode === true ? "Done" : "Edit"}
          </button>
        </div>

      </div>
    </div>
  )
}

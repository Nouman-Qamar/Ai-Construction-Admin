import { useState, useEffect } from "react"
import { X, Edit2 } from "lucide-react"

export default function Activeproject({ isOpen, project, onClose, onUpdate }) {
  const [isEditMode, setIsEditMode] = useState(false)

  // Local editable states
  const [editedName, setEditedName] = useState("")
  const [editedReason, setEditedReason] = useState("")

  // Load data into state whenever modal opens
  useEffect(() => {
    if (project) {
      setEditedName(project.name)
      setEditedReason(project.reason)
    }
  }, [project])

  if (!isOpen || !project) return null

  const handleEditToggle = () => {
    if (isEditMode) {
      // Save changes to parent
      onUpdate({
        ...project,
        name: editedName,
        reason: editedReason,
      })
    }

    setIsEditMode(!isEditMode)
  }

  const statusClass = project.status
    ? project.status.toLowerCase().replace(/ /g, "-")
    : ""

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

          {/* Contractor Section */}
          <div className="modal-section">
            <div className="contractor-row">
              <div className="contractor-avatar">
                {editedName.charAt(0)}
              </div>

              <div>
                {isEditMode ? (
                  <input
                    className="modal-input"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  <h3 className="contractor-name">{project.name}</h3>
                )}

                <p className="contractor-title">Contractor</p>
              </div>
            </div>
          </div>

          {/* Project Details */}
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

                {isEditMode ? (
                  <textarea
                    className="modal-textarea"
                    value={editedReason}
                    onChange={(e) => setEditedReason(e.target.value)}
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
            {isEditMode ? "Done" : "Edit"}
          </button>
        </div>

      </div>
    </div>
  )
}

import React, { useState, useEffect } from "react"
import { X, Edit2 } from "lucide-react"
import ReviewForm from "../../../Shared/ReviewForm"

export default function ContractorReviewModal({ isOpen, contractor, onClose }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialty: "",
    rating: "",
    projects: "",
    status: "",
  })

  useEffect(() => {
    if (contractor) {
      setForm({
        name: contractor.name || "",
        email: contractor.email || "",
        specialty: contractor.specialty || "",
        rating: contractor.rating || "",
        projects: contractor.projects || "",
        status: contractor.status || "",
      })
    }
  }, [contractor])

  if (isOpen === false || !contractor) {
    return null
  }

  const handleEditToggle = () => {
    setIsEditMode((s) => !s)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="modal-overlay">
      <div className="bottom-sheet">

        <div className="modal-header">
          <div>
            <h2 className="modal-title">{contractor.name}</h2>
            <p className="modal-subtitle">Contractor Review</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">

          <div className="modal-section">
            <div className="contractor-row">
              <div className="contractor-avatar">{contractor.name.charAt(0)}</div>

              <div>
                <h3 className="contractor-name">{contractor.name}</h3>
                <p className="contractor-title">{contractor.email}</p>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3 className="section-title">Contractor Details</h3>

            <ReviewForm
              item={contractor}
              form={form}
              onChange={handleChange}
              isEditMode={isEditMode}
              fields={[
                { label: "Specialty", key: "specialty" },
                { label: "Rating", key: "rating" },
                { label: "Projects", key: "projects" },
                { label: "Status", key: "status" },
              ]}
            />
          </div>

        </div>

        <div className="modal-footer">
          <button className="modal-btn cancel" onClick={onClose}>Close</button>

          <button className="modal-btn primary" onClick={handleEditToggle}>
            <Edit2 size={16} />
            {isEditMode ? "Done" : "Edit"}
          </button>
        </div>

      </div>
    </div>
  )
}

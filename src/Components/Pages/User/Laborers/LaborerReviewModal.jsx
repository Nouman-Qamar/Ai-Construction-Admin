import React, { useState, useEffect } from "react"
import { X, Edit2 } from "lucide-react"
import ReviewForm from "../../../Shared/ReviewForm"

export default function LaborerReviewModal({ isOpen, laborer, onClose }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    trade: "",
    rating: "",
    projects: "",
    status: "",
  })

  useEffect(() => {
    if (laborer) {
      setForm({
        name: laborer.name || "",
        email: laborer.email || "",
        trade: laborer.trade || "",
        rating: laborer.rating || "",
        projects: laborer.projects || "",
        status: laborer.status || "",
      })
    }
  }, [laborer])

  if (isOpen === false || !laborer) return null

  const handleEditToggle = () => setIsEditMode((s) => !s)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="modal-overlay">
      <div className="bottom-sheet">

        <div className="modal-header">
          <div>
            <h2 className="modal-title">{laborer.name}</h2>
            <p className="modal-subtitle">Laborer Profile</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">

          <div className="modal-section">
            <div className="contractor-row">
              <div className="contractor-avatar">{laborer.name.charAt(0)}</div>

              <div>
                <h3 className="contractor-name">{laborer.name}</h3>
                <p className="contractor-title">{laborer.email}</p>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3 className="section-title">Details</h3>

            <ReviewForm
              item={laborer}
              form={form}
              onChange={handleChange}
              isEditMode={isEditMode}
              fields={[
                { label: "Trade", key: "trade" },
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

import React from "react"

export default function ReviewForm({ item, form, onChange, isEditMode, fields = [] }) {
  return (
    <div className="details-grid">
      {fields.map(({ label, key }) => (
        <div className="detail-item" key={key}>
          <label>{label}</label>
          {isEditMode ? (
            <input
              className="modal-input"
              name={key}
              value={form[key] ?? ""}
              onChange={onChange}
            />
          ) : (
            <p>{item[key]}</p>
          )}
        </div>
      ))}
    </div>
  )
}

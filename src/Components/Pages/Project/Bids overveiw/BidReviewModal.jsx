
import { useState } from "react"
import { X, Edit2 } from "lucide-react"

export default function BidReviewModal({ isOpen, bid, onClose }) {
  
  const [isEditMode, setIsEditMode] = useState(false)

 
  if (isOpen === false || !bid) {
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
  if (bid.status) {
    statusClass = bid.status.toLowerCase().replace(/ /g, "-")
  }

  return (
    <div className="modal-overlay">
      <div className="bottom-sheet">

       
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{bid.project}</h2>
            <p className="modal-subtitle">Bid Review</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        
        <div className="modal-body">

         
          <div className="modal-section">
            <div className="contractor-row">
              <div className="contractor-avatar">
                {bid.name.charAt(0)}
              </div>

              <div>
                <h3 className="contractor-name">{bid.name}</h3>
                <p className="contractor-title">Bid Contractor</p>
              </div>
            </div>
          </div>

          
          <div className="modal-section">
            <h3 className="section-title">Bid Details</h3>

            <div className="details-grid">

              
              <div className="detail-item">
                <label>Bid Amount</label>

                {isEditMode === true ? (
                  <input
                    className="modal-input"
                    defaultValue={bid.bid}
                  />
                ) : (
                  <p>{bid.bid}</p>
                )}
              </div>

              
              <div className="detail-item">
                <label>Timeline</label>

                {isEditMode === true ? (
                  <input
                    className="modal-input"
                    defaultValue={bid.timeline}
                  />
                ) : (
                  <p>{bid.timeline}</p>
                )}
              </div>

             
              <div className="detail-item">
                <label>Status</label>
                <p className={`status-tag ${statusClass}`}>
                  {bid.status}
                </p>
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

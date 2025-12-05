import { useState } from "react";
import { X, Edit2 } from "lucide-react";
import "./BidReviewModal.css";

export default function BidReviewModal({ isOpen, bid, onClose }) {
  const [isEditMode, setIsEditMode] = useState(false);

  if (!isOpen || !bid) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Header */}

        <div className="modal-header">
          <div>
            <h2 className="modal-title">{bid.project}</h2>
            <p className="modal-subtitle">Bid Review</p>
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
                  {bid.name.charAt(0)}
                </div>
                <div>
                  <h3 className="bid-contractor-name">{bid.name}</h3>
                  <p className="bid-contractor-title">Bid Contractor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bid Details */}
          <div className="bid-section">
            <h3 className="bid-section-title">Bid Details</h3>
            <div className="bid-details-grid">
              <div className="bid-detail-item">
                <label className="bid-detail-label">Bid Amount</label>
                <p className="bid-detail-value">{bid.bid}</p>
              </div>
              <div className="bid-detail-item">
                <label className="bid-detail-label">Timeline</label>
                <p className="bid-detail-value">{bid.timeline}</p>
              </div>
              <div className="bid-detail-item">
                <label className="bid-detail-label">Status</label>
                <p className={`bid-detail-value bid-status-${bid.status.toLowerCase().replace(" ", "-")}`}>
                  {bid.status}
                </p>
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

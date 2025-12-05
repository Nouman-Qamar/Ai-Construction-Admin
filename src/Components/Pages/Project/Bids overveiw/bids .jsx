import { useState } from "react";
import { Eye, CheckCircle, XCircle, Calendar, DollarSign } from "lucide-react";
import BidReviewModal from "../BidReviewModal";
import "./bids.css";

export default function BidsOverview() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "John Smith",
      project: "Shopping Mall Renovation - Bid 1",
      bid: "$2,350,000",
      bidAmount: 2350000,
      timeline: "8 months",
      status: "Under Review",
    },
    {
      id: 2,
      name: "James Brown",
      project: "Shopping Mall Renovation - Bid 2",
      bid: "$2,500,000",
      bidAmount: 2500000,
      timeline: "7 months",
      status: "Accepted",
    },
    {
      id: 3,
      name: "Ahmed Khan",
      project: "Office Complex Construction - Bid 3",
      bid: "$3,200,000",
      bidAmount: 3200000,
      timeline: "10 months",
      status: "Pending",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      project: "Residential Building - Bid 4",
      bid: "$1,800,000",
      bidAmount: 1800000,
      timeline: "6 months",
      status: "Rejected",
    },
    {
      id: 5,
      name: "Mike Johnson",
      project: "Shopping Mall Renovation - Bid 5",
      bid: "$2,750,000",
      bidAmount: 2750000,
      timeline: "9 months",
      status: "Complete",
    },
  ]);

  const [selectedBid, setSelectedBid] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedBids, setSelectedBids] = useState(new Set());
  const [searchText, setSearchText] = useState("");

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedBids(new Set(filteredProjects.map((p) => p.id)));
    } else {
      setSelectedBids(new Set());
    }
  };

  const handleSelectBid = (id) => {
    const newSelected = new Set(selectedBids);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedBids(newSelected);
    setSelectAll(newSelected.size === filteredProjects.length);
  };

  const handleReview = (project) => {
    setSelectedBid(project);
    setIsModalOpen(true);
  };

  const handleAccept = (id) => {
    setProjects(
      projects.map((p) =>
        p.id === id ? { ...p, status: "Accepted" } : p
      )
    );
  };

  const handleReject = (id) => {
    setProjects(
      projects.map((p) =>
        p.id === id ? { ...p, status: "Rejected" } : p
      )
    );
  };

  //Filter projects based on search
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchText.toLowerCase()) ||
      project.project.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="bids-overview-wrapper">
      <div className="bids-header">
        <h2 className="bids-title">Bids Overview</h2>
      </div>

      {/* Search Bar */}
      <div className="bids-search-section">
        <input
          type="text"
          placeholder="Search by contractor name or project..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="bids-search-input"
        />
      </div>

      <div className="bids-content">
        <label className="bids-select-all">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="bids-checkbox"
          />
          <span>Select all {filteredProjects.length} bids</span>
        </label>

        {filteredProjects.length === 0 ? (
          <div className="bids-empty-state">
            <p>No bids found matching your search</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="bids-card">
              <div className="bids-card-left">
                <input
                  type="checkbox"
                  checked={selectedBids.has(project.id)}
                  onChange={() => handleSelectBid(project.id)}
                  className="bids-checkbox"
                />

                {/* Avatar */}
                <div className="bids-avatar">
                  {project.name.charAt(0)}
                </div>

                {/* Details */}
                <div className="bids-details">
                  <h3 className="bids-name">{project.name}</h3>
                  <p className="bids-project">{project.project}</p>

                  <div className="bids-info">
                    <div className="bids-info-item">
                      <DollarSign size={18} />
                      <span className="bids-font-medium">{project.bid}</span>
                    </div>

                    <div className="bids-info-item">
                      <Calendar size={18} />
                      <span className="bids-font-medium">{project.timeline}</span>
                    </div>

                    <span className={`bids-status bids-status-${project.status.toLowerCase().replace(" ", "-")}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bids-actions">
                <button
                  className="bids-btn bids-btn-review"
                  onClick={() => handleReview(project)}
                >
                  <Eye size={18} />
                  Review
                </button>

                <button
                  className="bids-btn bids-btn-accept"
                  onClick={() => handleAccept(project.id)}
                >
                  <CheckCircle size={18} />
                  Accept
                </button>

                <button
                  className="bids-btn bids-btn-reject"
                  onClick={() => handleReject(project.id)}
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <BidReviewModal
        isOpen={isModalOpen}
        bid={selectedBid}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
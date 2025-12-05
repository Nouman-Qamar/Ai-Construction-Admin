import { useState } from "react";
import { Eye, Calendar, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { cancelProjectsData } from "./Cancel projects/cancelProjectsData";
import BidReviewModal from "./Bids overveiw/BidReviewModal";
import CancelReviewModal from "./Cancel projects/CancelReviewModal";
import "./AllProjects.css";

export default function AllProjects() {
  // Bid data
  const bidData = [
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
  ];

  const [activeTab, setActiveTab] = useState("bids");
  const [bids, setBids] = useState(bidData);
  const [cancelProjects, setCancelProjects] = useState(cancelProjectsData);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [searchText, setSearchText] = useState("");

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(new Set(filteredItems.map((p) => p.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === filteredItems.length);
  };

  const handleReview = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAccept = (id) => {
    if (activeTab === "bids") {
      setBids(
        bids.map((p) =>
          p.id === id ? { ...p, status: "Accepted" } : p
        )
      );
    }
  };

  const handleReject = (id) => {
    if (activeTab === "bids") {
      setBids(
        bids.map((p) =>
          p.id === id ? { ...p, status: "Rejected" } : p
        )
      );
    }
  };

  // Get current data based on active tab
  const currentData = activeTab === "bids" ? bids : cancelProjects;

  // Filter items based on search
  const filteredItems = currentData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.project.toLowerCase().includes(searchText.toLowerCase())
  );

  const getTabLabel = () => {
    return activeTab === "bids" ? "Bids Overview" : "Cancel Projects";
  };

  return (
    <div className="all-projects-wrapper">
      <div className="all-projects-header">
        <h2 className="all-projects-title">All Projects</h2>
      </div>

      {/* Tabs */}
      <div className="projects-tabs">
        <button
          className={`projects-tab ${activeTab === "bids" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("bids");
            setSearchText("");
            setSelectedItems(new Set());
            setSelectAll(false);
          }}
        >
          <CheckCircle size={18} />
          Bids Overview
        </button>
        <button
          className={`projects-tab ${activeTab === "cancel" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("cancel");
            setSearchText("");
            setSelectedItems(new Set());
            setSelectAll(false);
          }}
        >
          <XCircle size={18} />
          Cancel Projects
        </button>
      </div>

      {/* Search Bar */}
      <div className="projects-search-section">
        <input
          type="text"
          placeholder="Search by contractor name or project..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="projects-search-input"
        />
      </div>

      <div className="projects-content">
        <label className="projects-select-all">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="projects-checkbox"
          />
          <span>Select all {filteredItems.length} {activeTab === "bids" ? "bids" : "projects"}</span>
        </label>

        {filteredItems.length === 0 ? (
          <div className="projects-empty-state">
            <p>No {activeTab === "bids" ? "bids" : "projects"} found matching your search</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="projects-card">
              <div className="projects-card-left">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="projects-checkbox"
                />

                {/* Avatar */}
                <div className="projects-avatar">
                  {item.name.charAt(0)}
                </div>

                {/* Details */}
                <div className="projects-details">
                  <h3 className="projects-name">{item.name}</h3>
                  <p className="projects-project">{item.project}</p>

                  <div className="projects-info">
                    <div className="projects-info-item">
                      <DollarSign size={18} />
                      <span className="projects-font-medium">{item.bid}</span>
                    </div>

                    <div className="projects-info-item">
                      <Calendar size={18} />
                      <span className="projects-font-medium">{item.timeline}</span>
                    </div>

                    <span className={`projects-status projects-status-${item.status.toLowerCase().replace(/ /g, "-")}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="projects-actions">
                <button
                  className="projects-btn projects-btn-review"
                  onClick={() => handleReview(item)}
                >
                  <Eye size={18} />
                  Review
                </button>

                {activeTab === "bids" && (
                  <>
                    <button
                      className="projects-btn projects-btn-accept"
                      onClick={() => handleAccept(item.id)}
                    >
                      <CheckCircle size={18} />
                      Accept
                    </button>

                    <button
                      className="projects-btn projects-btn-reject"
                      onClick={() => handleReject(item.id)}
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {activeTab === "bids" ? (
        <BidReviewModal
          isOpen={isModalOpen}
          bid={selectedItem}
          onClose={() => setIsModalOpen(false)}
        />
      ) : (
        <CancelReviewModal
          isOpen={isModalOpen}
          project={selectedItem}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle, Calendar, DollarSign, Plus } from "lucide-react";
import { message } from "antd";
import BidReviewModal from "./BidsOverveiw/BidReviewModal";
import CancelReviewModal from "./CancelProjects/CancelReviewModal";
import Activeproject from "./activeProject/active";
import PendingApproval from "./pendingapproval";
import CompleteProject from "./completeproject";
import projectService from "../../../Services/projectService";
import bidService from "../../../Services/bidService";
import "./AllProjects.css";

export default function AllProjects({ onProjectAdded }) {
  const [activeTab, setActiveTab] = useState("bids");
  const [bids, setBids] = useState([]);
  const [cancelProjects, setCancelProjects] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch data from backend
  useEffect(() => {
    if (activeTab === "bids") {
      fetchBids();
    } else if (activeTab === "active") {
      fetchActiveProjects();
    } else if (activeTab === "cancel") {
      fetchCancelledProjects();
    }
  }, [activeTab]);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const response = await bidService.getAllBids();
      const formattedBids = response.data.map(bid => ({
        id: bid._id,
        name: bid.contractorId.name || "Unknown Contractor",
        project: bid.projectId.title || "Unknown Project",
        bid: `$${bid.amount.toLocaleString()}`,
        bidAmount: bid.amount || 0,
        timeline: bid.timeline || "N/A",
        status: bid.status || "Pending"
      }));
      setBids(formattedBids);
    } catch (error) {
      console.error("Error fetching bids:", error);
      message.error("Failed to fetch bids");
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveProjects = async () => {
    setLoading(true);
    try {
      const response = await projectService.getActiveProjects();
      const formattedProjects = response.data.map(project => ({
        id: project._id,
        name: project.clientId?.name || project.clientId?.company || "Unknown Client",
        project: project.title,
        bid: `$${project.budget?.toLocaleString() || 0}`,
        timeline: project.timeline || "N/A",
        status: project.status,
        progress: project.progress || 0
      }));
      setActiveProjects(formattedProjects);
    } catch (error) {
      console.error("Error fetching active projects:", error);
      message.error("Failed to fetch active projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchCancelledProjects = async () => {
    setLoading(true);
    try {
      const response = await projectService.getAllProjects({ status: "Cancelled" });
      const formattedProjects = response.data.map(project => ({
        id: project._id,
        name: project.clientId?.name || project.clientId?.company || "Unknown Client",
        project: project.title,
        bid: `$${project.budget?.toLocaleString() || 0}`,
        timeline: project.timeline || "N/A",
        status: "Cancelled",
        reason: project.cancellationReason || "No reason provided",
        requestDate: project.cancelledAt ? new Date(project.cancelledAt).toISOString().split("T")[0] : "N/A"
      }));
      setCancelProjects(formattedProjects);
    } catch (error) {
      console.error("Error fetching cancelled projects:", error);
      message.error("Failed to fetch cancelled projects");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateActive = (updated) => {
    setActiveProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);

    if (checked) {
      const newSet = new Set();
      for (let item of filteredItems) {
        newSet.add(item.id);
      }
      setSelectedItems(newSet);
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id) => {
    const copy = new Set(selectedItems);
    if (copy.has(id)) copy.delete(id);
    else copy.add(id);
    setSelectedItems(copy);
    setSelectAll(copy.size === filteredItems.length);
  };

  const handleReview = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAccept = async (id) => {
    if (activeTab === "bids") {
      try {
        await bidService.acceptBid(id, "admin"); // Replace with actual admin ID
        message.success("Bid accepted successfully");
        fetchBids(); // Refresh data
      } catch (error) {
        console.error("Error accepting bid:", error);
        message.error("Failed to accept bid");
      }
    }
  };

  const handleReject = async (id) => {
    if (activeTab === "bids") {
      try {
        await bidService.rejectBid(id, "admin"); // Replace with actual admin ID
        message.success("Bid rejected successfully");
        fetchBids(); // Refresh data
      } catch (error) {
        console.error("Error rejecting bid:", error);
        message.error("Failed to reject bid");
      }
    }
  };

  const handleAddNewProject = () => {
    // This should open a form modal to create new project
    message.info("Add new project form - to be implemented");
    if (onProjectAdded) onProjectAdded();
  };

  let currentData = activeTab === "bids" ? bids : activeTab === "cancel" ? cancelProjects : [];

  const filteredItems = currentData.filter(item => {
    return item.name.toLowerCase().includes(searchText.toLowerCase()) ||
           item.project.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <div className="all-projects-wrapper">
      <div className="all-projects-header">
        <h2 className="all-projects-title">All Projects</h2>
        <button
          onClick={handleAddNewProject}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8, 
            padding: "10px 16px", 
            backgroundColor: "#f97316", 
            color: "#fff", 
            border: "none", 
            borderRadius: 6, 
            cursor: "pointer", 
            fontSize: 14, 
            fontWeight: 600 
          }}
        >
          <Plus size={18} /> Add New
        </button>
      </div>

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
          <CheckCircle size={18} /> Bids Overview
        </button>
        <button
          className={`projects-tab ${activeTab === "active" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("active");
            setSearchText("");
            setSelectedItems(new Set());
            setSelectAll(false);
          }}
        >
          <CheckCircle size={18} /> Active Projects
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
          <CheckCircle size={18} /> Canceled Projects
        </button>
        <button
          className={`projects-tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("pending");
            setSearchText("");
            setSelectedItems(new Set());
            setSelectAll(false);
          }}
        >
          <CheckCircle size={18} /> Pending Approvals
        </button>
        <button
          className={`projects-tab ${activeTab === "complete" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("complete");
            setSearchText("");
            setSelectedItems(new Set());
            setSelectAll(false);
          }}
        >
          <CheckCircle size={18} /> Complete Projects
        </button>
      </div>

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
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : activeTab === "bids" || activeTab === "cancel" ? (
          <>
            <label className="projects-select-all">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="projects-checkbox"
              />
              <span>Select all {filteredItems.length}</span>
            </label>
            {filteredItems.length === 0 ? (
              <div className="projects-empty-state">
                <p>No results found</p>
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
                    <div className="projects-avatar">{item.name.charAt(0)}</div>
                    <div className="projects-details">
                      <h3 className="projects-name">{item.name}</h3>
                      <p className="projects-project">{item.project}</p>
                      <div className="projects-info">
                        <div className="projects-info-item">
                          <DollarSign size={18} />
                          <span>{item.bid}</span>
                        </div>
                        <div className="projects-info-item">
                          <Calendar size={18} />
                          <span>{item.timeline}</span>
                        </div>
                        <span className={`projects-status projects-status-${item.status?.toLowerCase().replace(/\s/g, "-")}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="projects-action">
                    <button
                      className="projects-btn projects-btn-review"
                      onClick={() => handleReview(item)}
                    >
                      <Eye size={18} /> Review
                    </button>
                    {activeTab === "bids" ? (
                      <>
                        <button
                          className="projects-btn projects-btn-accept"
                          onClick={() => handleAccept(item.id)}
                        >
                          <CheckCircle size={18} /> Accept
                        </button>
                        <button
                          className="projects-btn projects-btn-reject"
                          onClick={() => handleReject(item.id)}
                        >
                          <XCircle size={18} /> Reject
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </>
        ) : activeTab === "active" ? (
          (() => {
            const filteredActive = activeProjects.filter(
              (item) =>
                item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                item.project?.toLowerCase().includes(searchText.toLowerCase())
            );
            return filteredActive.length === 0 ? (
              <div className="projects-empty-state">
                <p>No active projects found</p>
              </div>
            ) : (
              filteredActive.map((item) => (
                <div key={item.id} className="projects-card">
                  <div className="projects-card-left">
                    <div className="projects-avatar">{item.name.charAt(0)}</div>
                    <div className="projects-details">
                      <h3 className="projects-name">{item.name}</h3>
                      <p className="projects-project">{item.project}</p>
                      <div className="projects-info">
                        <div className="projects-info-item">
                          <DollarSign size={18} />
                          <span>{item.bid}</span>
                        </div>
                        <div className="projects-info-item">
                          <Calendar size={18} />
                          <span>{item.timeline}</span>
                        </div>
                        <span
                          className={`projects-status projects-status-${item.status
                            ?.toLowerCase()
                            .replace(/ /g, "-")}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="projects-actions">
                    <button
                      className="projects-btn projects-btn-review"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsModalOpen(true);
                      }}
                    >
                      <Eye size={18} /> Review
                    </button>
                    <button className="projects-btn projects-btn-accept" disabled>
                      <CheckCircle size={18} /> Action
                    </button>
                  </div>
                </div>
              ))
            );
          })()
        ) : activeTab === "pending" ? (
          <PendingApproval />
        ) : activeTab === "complete" ? (
          <CompleteProject />
        ) : null}
      </div>

      {activeTab === "bids" && (
        <BidReviewModal
          isOpen={isModalOpen}
          bid={selectedItem}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {activeTab === "cancel" && (
        <CancelReviewModal
          isOpen={isModalOpen}
          project={selectedItem}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {activeTab === "active" && (
        <Activeproject
          isOpen={isModalOpen}
          project={selectedItem}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
          onUpdate={handleUpdateActive}
        />
      )}
    </div>
  );
}

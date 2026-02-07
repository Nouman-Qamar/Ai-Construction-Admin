import React, { useState, useEffect } from "react";
import { Button, Input, message, Spin } from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  StarFilled
} from "@ant-design/icons";
import { getSpecialtyColor, getSpecialtyTextColor } from "./contractorsData";
import contractorService from "../../../../Services/contractorService";
import "./Contractors.css";
import ContractorReviewModal from "./ContractorReviewModal";

const Contractors = () => {
  const [searchText, setSearchText] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch contractors from backend
  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    setLoading(true);
    try {
      const response = await contractorService.getAllContractors();
      // Map backend data to frontend format
      const contractorsData = response.data.map((contractor, index) => ({
        key: contractor._id,
        id: contractor._id,
        name: contractor.name,
        email: contractor.email,
        phone: contractor.phone || "N/A",
        specialty: contractor.specialty || "General",
        rating: contractor.rating || 0,
        projects: contractor.projectsCompleted || 0,
        status: contractor.status || "Active",
        experience: contractor.experience || 0,
        certifications: contractor.certifications || [],
        portfolio: contractor.portfolio || [],
      }));
      setContractors(contractorsData);
    } catch (error) {
      console.error("Error fetching contractors:", error);
      message.error("Failed to fetch contractors data");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = contractors.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.specialty.toLowerCase().includes(searchText.toLowerCase())
  );

  const TableContainer = () => (
    <div className="contractors-table">
      {/* Table Header */}
      <div className="contractors-table-header">
        <div className="contractors-col-contractor">Contractor</div>
        <div className="contractors-col-specialty">Specialty</div>
        <div className="contractors-col-rating">Rating</div>
        <div className="contractors-col-projects">Projects</div>
        <div className="contractors-col-status">Status</div>
        <div className="contractors-col-actions">Actions</div>
      </div>

      {/* Table Body */}
      <div className="contractors-table-body">
        {filteredData.map((contractor) => (
          <div key={contractor.key} className="contractors-table-row">
            {/* Contractor Info */}
            <div className="contractors-col-contractor">
              <div className="contractors-row-content">
                <div className="contractors-row-info">
                  <p className="contractors-row-name">{contractor.name}</p>
                  <p className="contractors-row-email">{contractor.email}</p>
                </div>
              </div>
            </div>

            {/* Specialty */}
            <div className="contractors-col-specialty">
              <span
                className="contractors-specialty-badge"
                style={{
                  backgroundColor: getSpecialtyColor(contractor.specialty),
                  color: getSpecialtyTextColor(contractor.specialty)
                }}
              >
                {contractor.specialty}
              </span>
            </div>

            {/* Rating */}
            <div className="contractors-col-rating">
              <div className="contractors-rating">
                <StarFilled className="contractors-star" />
                <span>{contractor.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Projects */}
            <div className="contractors-col-projects">
              <span className="contractors-projects-count">{contractor.projects}</span>
            </div>

            {/* Status */}
            <div className="contractors-col-status">
              <span className={`contractors-status-badge contractors-status-${contractor.status.toLowerCase()}`}>
                {contractor.status}
              </span>
            </div>

            {/* Actions */}
            <div className="contractors-col-actions">
              <div className="contractors-actions-group">
                <Button
                  className="contractors-btn-view"
                  onClick={() => {
                    setSelectedContractor(contractor);
                    setIsReviewOpen(true);
                  }}
                >
                  View Profile
                </Button>
                <MoreOutlined className="contractors-more-icon" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="contractors-wrapper">
      <div className="contractors-header">
        <h2 className="contractors-title">Contractors</h2>
        <p style={{ color: "#666", marginTop: "8px" }}>
          Showing {filteredData.length} contractor{filteredData.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search Bar */}
      <div className="contractors-search-section">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by name, email, or specialty..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="contractors-search-input"
        />
      </div>

      {/* Table Container */}
      <div className="contractors-content">
        {filteredData.length === 0 ? (
          <div className="contractors-empty-state">
            <p>No contractors found matching your search</p>
          </div>
        ) : (
          <TableContainer />
        )}
      </div>

      {/* Review Modal */}
      <ContractorReviewModal
        isOpen={isReviewOpen}
        contractor={selectedContractor}
        onClose={() => {
          setIsReviewOpen(false);
          setSelectedContractor(null);
        }}
      />
    </div>
  );
};

export default Contractors;

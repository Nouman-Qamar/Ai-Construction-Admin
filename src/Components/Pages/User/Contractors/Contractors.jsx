import React, { useState } from "react";
import { Button, Input } from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  StarFilled
} from "@ant-design/icons";
import { contractorsData, getSpecialtyColor, getSpecialtyTextColor } from "./contractorsData";
import "./Contractors.css";
import ContractorReviewModal from "./ContractorReviewModal";

const Contractors = () => {
  const [searchText, setSearchText] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);

  const filteredData = contractorsData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.specialty.toLowerCase().includes(searchText.toLowerCase()) 
  );

  return (
    <div className="contractors-wrapper">
      <div className="contractors-header">
        <h2 className="contractors-title">Contractors</h2>
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
                        color: getSpecialtyTextColor(contractor.specialty),
                      }}
                    >
                      {contractor.specialty}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="contractors-col-rating">
                    <div className="contractors-rating">
                      <StarFilled className="contractors-star" />
                      <span>{contractor.rating}</span>
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="contractors-col-projects">
                    <span className="contractors-projects-count">{contractor.projects}</span>
                  </div>

                  {/* Status */}
                  <div className="contractors-col-status">
                    <span className="contractors-status-badge contractors-status-active">
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

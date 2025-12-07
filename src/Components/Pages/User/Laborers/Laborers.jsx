import React, { useState } from "react";
import { Button, Input } from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  StarFilled
} from "@ant-design/icons";
import { laborersData, getTradeColor, getTradeTextColor } from "./laborersData";
import "./Laborers.css";
import LaborerReviewModal from "./LaborerReviewModal";

const Laborers = () => {
  const [searchText, setSearchText] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedLaborer, setSelectedLaborer] = useState(null);

  const filteredData = laborersData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.trade.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="laborers-wrapper">
      <div className="laborers-header">
        <h2 className="laborers-title">Laborers</h2>
      </div>

      {/* Search Bar */}
      <div className="laborers-search-section">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by name, email, or trade..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="laborers-search-input"
        />
      </div>

      {/* Table Container */}
      <div className="laborers-content">
        {filteredData.length === 0 ? (
          <div className="laborers-empty-state">
            <p>No laborers found matching your search</p>
          </div>
        ) : (
          <div className="laborers-table">
            {/* Table Header */}
            <div className="laborers-table-header">
              <div className="laborers-col-contractor">Laborer</div>
              <div className="laborers-col-specialty">Trade</div>
              <div className="laborers-col-rating">Rating</div>
              <div className="laborers-col-projects">Projects</div>
              <div className="laborers-col-status">Status</div>
              <div className="laborers-col-actions">Actions</div>
            </div>

            {/* Table Body */}
            <div className="laborers-table-body">
              {filteredData.map((laborer) => (
                <div key={laborer.key} className="laborers-table-row">
                  {/* Laborer Info */}
                  <div className="laborers-col-contractor">
                    <div className="laborers-row-content">
                      <div className="laborers-row-info">
                        <p className="laborers-row-name">{laborer.name}</p>
                        <p className="laborers-row-email">{laborer.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trade */}
                  <div className="laborers-col-specialty">
                    <span
                      className="laborers-specialty-badge"
                      style={{
                        backgroundColor: getTradeColor(laborer.trade),
                        color: getTradeTextColor(laborer.trade),
                      }}
                    >
                      {laborer.trade}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="laborers-col-rating">
                    <div className="laborers-rating">
                      <StarFilled className="laborers-star" />
                      <span>{laborer.rating}</span>
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="laborers-col-projects">
                    <span className="laborers-projects-count">{laborer.projects}</span>
                  </div>

                  {/* Status */}
                  <div className="laborers-col-status">
                    <span className="laborers-status-badge laborers-status-active">
                      {laborer.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="laborers-col-actions">
                    <div className="laborers-actions-group">
                      <Button
                        className="laborers-btn-view"
                        onClick={() => {
                          setSelectedLaborer(laborer);
                          setIsReviewOpen(true);
                        }}
                      >
                        View Profile
                      </Button>
                      <MoreOutlined className="laborers-more-icon" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Laborer Review Modal */}
      <LaborerReviewModal
        isOpen={isReviewOpen}
        laborer={selectedLaborer}
        onClose={() => {
          setIsReviewOpen(false);
          setSelectedLaborer(null);
        }}
      />
    </div>
  );
};

export default Laborers;

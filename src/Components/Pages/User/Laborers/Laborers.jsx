import React, { useState, useEffect } from "react";
import { Button, Input, message, Spin } from "antd";
import { SearchOutlined, MoreOutlined, StarFilled } from "@ant-design/icons";
import laborerService from "../../../../Services/laborerService";
import "./Laborers.css";
import LaborerReviewModal from "./LaborerReviewModal";

// Helper functions for skill colors
const getSkillColor = (skill) => {
  const colors = {
    'Construction': '#e8f5e9',
    'Welding': '#e3f2fd',
    'Equipment Operation': '#fff3e0',
    'General Labor': '#fce4ec',
    'Demolition': '#f3e5f5',
    'Landscaping': '#e0f2f1',
  };
  return colors[skill] || '#f5f5f5';
};

const getSkillTextColor = (skill) => {
  const colors = {
    'Construction': '#2e7d32',
    'Welding': '#1565c0',
    'Equipment Operation': '#e65100',
    'General Labor': '#c2185b',
    'Demolition': '#6a1b9a',
    'Landscaping': '#00695c',
  };
  return colors[skill] || '#616161';
};

const Laborers = () => {
  const [laborers, setLaborers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedLaborer, setSelectedLaborer] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // Fetch laborers from API
  const fetchLaborers = async (page = 1, limit = 20, search = "") => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search: search || undefined,
      };
      
      const response = await laborerService.getAllLaborers(params);

      // Normalize response: support array, { data: [...] }, or { success, data }
      let items = [];
      let meta = {};
      if (Array.isArray(response)) {
        items = response;
      } else if (response && response.data) {
        items = response.data.data ?? response.data;
        meta = {
          currentPage: response.data.currentPage,
          limit: response.data.limit,
          total: response.data.total,
        };
      } else if (response && response.success && response.data) {
        items = response.data.data ?? response.data;
        meta = {
          currentPage: response.data.currentPage,
          limit: response.data.limit,
          total: response.data.total,
        };
      } else if (response && response.items) {
        items = response.items;
      } else if (response) {
        items = response;
      }

      if (!Array.isArray(items)) items = items ? [items] : [];

      // Map backend data to frontend format
      const formattedData = items.map((laborer, index) => ({
        key: laborer._id || laborer.id || index,
        _id: laborer._id || laborer.id,
        name: laborer.name,
        email: laborer.email,
        skill: laborer.skills?.[0] || laborer.skill || 'General Labor',
        rating: laborer.rating || 0,
        projects: laborer.completedProjects || laborer.projects || 0,
        status: laborer.isActive || laborer.status === 'Active' ? 'Active' : 'Inactive',
        isActive: laborer.isActive,
        phone: laborer.phone,
        address: laborer.address,
        experience: laborer.experience || 0,
      }));

      setLaborers(formattedData);
      setPagination({
        current: meta.currentPage || page,
        pageSize: meta.limit || limit,
        total: meta.total ?? formattedData.length,
      });
    } catch (error) {
      console.error("Error fetching laborers:", error);
      message.error(error.response?.data?.message || "Failed to fetch laborers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaborers(pagination.current, pagination.pageSize, searchText);
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLaborers(1, pagination.pageSize, searchText);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const filteredData = laborers.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.skill.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleReviewClick = (laborer) => {
    setSelectedLaborer(laborer);
    setIsReviewOpen(true);
  };

  const handleReviewClose = () => {
    setIsReviewOpen(false);
    setSelectedLaborer(null);
  };

  const handleReviewSubmit = async (action, reason) => {
    try {
      setLoading(true);
      
      if (action === 'approve') {
        await laborerService.approveLaborer(selectedLaborer._id);
        message.success('Laborer approved successfully');
      } else if (action === 'suspend') {
        await laborerService.suspendLaborer(selectedLaborer._id, { reason });
        message.success('Laborer suspended successfully');
      } else if (action === 'reject') {
        await laborerService.rejectLaborer(selectedLaborer._id, { reason });
        message.success('Laborer rejected successfully');
      }
      
      handleReviewClose();
      // Refresh list
      fetchLaborers(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      console.error("Error processing laborer:", error);
      message.error(error.response?.data?.message || "Failed to process laborer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="laborers-wrapper">
      <div className="laborers-header">
        <h2 className="laborers-title">Laborers</h2>
      </div>

      {/* Search Bar */}
      <div className="laborers-search-section">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by name, email, or skill..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="laborers-search-input"
        />
      </div>

      {/* Table Container */}
      <Spin spinning={loading}>
        <div className="laborers-content">
          {filteredData.length === 0 ? (
            <div className="laborers-empty-state">
              <p>No laborers found matching your search</p>
            </div>
          ) : (
            <div className="laborers-table">
              {/* Table Header */}
              <div className="laborers-table-header">
                <div className="laborers-col-laborer">Laborer</div>
                <div className="laborers-col-skill">Skill</div>
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
                    <div className="laborers-col-laborer">
                      <div className="laborers-row-content">
                        <div className="laborers-row-info">
                          <p className="laborers-row-name">{laborer.name}</p>
                          <p className="laborers-row-email">{laborer.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Skill */}
                    <div className="laborers-col-skill">
                      <span
                        className="laborers-skill-badge"
                        style={{
                          backgroundColor: getSkillColor(laborer.skill),
                          color: getSkillTextColor(laborer.skill),
                        }}
                      >
                        {laborer.skill}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="laborers-col-rating">
                      <div className="laborers-rating">
                        <StarFilled className="laborers-star" />
                        <span>{laborer.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Projects */}
                    <div className="laborers-col-projects">
                      <span className="laborers-projects-count">{laborer.projects}</span>
                    </div>

                    {/* Status */}
                    <div className="laborers-col-status">
                      <span
                        className={`laborers-status-badge ${
                          laborer.status === "Active"
                            ? "laborers-status-active"
                            : "laborers-status-inactive"
                        }`}
                      >
                        {laborer.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="laborers-col-actions">
                      <Button
                        type="link"
                        icon={<MoreOutlined />}
                        onClick={() => handleReviewClick(laborer)}
                        className="laborers-action-btn"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Spin>

      {/* Review Modal */}
      {selectedLaborer && (
        <LaborerReviewModal
          open={isReviewOpen}
          laborer={selectedLaborer}
          onClose={handleReviewClose}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default Laborers;

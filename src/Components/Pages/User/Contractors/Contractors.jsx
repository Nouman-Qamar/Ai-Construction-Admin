import React, { useState, useEffect } from "react";
import { Button, Input, message, Spin } from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  StarFilled
} from "@ant-design/icons";
import contractorService from "../../../../Services/contractorService";
import "./Contractors.css";
import ContractorReviewModal from "./ContractorReviewModal";

// Keep these helper functions
const getSpecialtyColor = (specialty) => {
  const colors = {
    'Electrical': '#e8f5e9',
    'Plumbing': '#e3f2fd',
    'Carpentry': '#fff3e0',
    'Masonry': '#fce4ec',
    'HVAC': '#f3e5f5',
    'Painting': '#e0f2f1',
    'Roofing': '#fff8e1',
  };
  return colors[specialty] || '#f5f5f5';
};

const getSpecialtyTextColor = (specialty) => {
  const colors = {
    'Electrical': '#2e7d32',
    'Plumbing': '#1565c0',
    'Carpentry': '#e65100',
    'Masonry': '#c2185b',
    'HVAC': '#6a1b9a',
    'Painting': '#00695c',
    'Roofing': '#f57f17',
  };
  return colors[specialty] || '#616161';
};

const Contractors = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // Fetch contractors from API
  const fetchContractors = async (page = 1, limit = 20, search = "") => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search: search || undefined,
      };
      
      const response = await contractorService.getAllContractors(params);

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
      const formattedData = items.map((contractor, index) => ({
        key: contractor._id || contractor.id || index,
        _id: contractor._id || contractor.id,
        name: contractor.name,
        email: contractor.email,
        specialty: contractor.specialty || 'General',
        rating: contractor.rating || 0,
        projects: contractor.completedProjects || contractor.projects || 0,
        status: contractor.isActive || contractor.status === 'Active' ? 'Active' : 'Inactive',
        isActive: contractor.isActive,
        phone: contractor.phone,
        address: contractor.address,
      }));

      setContractors(formattedData);
      setPagination({
        current: meta.currentPage || page,
        pageSize: meta.limit || limit,
        total: meta.total ?? formattedData.length,
      });
    } catch (error) {
      console.error("Error fetching contractors:", error);
      message.error(error.response?.data?.message || "Failed to fetch contractors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors(pagination.current, pagination.pageSize, searchText);
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchContractors(1, pagination.pageSize, searchText);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const filteredData = contractors.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.specialty.toLowerCase().includes(searchText.toLowerCase()) 
  );

  const handleReviewClick = (contractor) => {
    setSelectedContractor(contractor);
    setIsReviewOpen(true);
  };

  const handleReviewClose = () => {
    setIsReviewOpen(false);
    setSelectedContractor(null);
  };

  const handleReviewSubmit = async (action, reason) => {
    try {
      setLoading(true);
      
      if (action === 'approve') {
        await contractorService.approveContractor(selectedContractor._id);
        message.success('Contractor approved successfully');
      } else if (action === 'suspend') {
        await contractorService.suspendContractor(selectedContractor._id, { reason });
        message.success('Contractor suspended successfully');
      } else if (action === 'reject') {
        await contractorService.rejectContractor(selectedContractor._id, { reason });
        message.success('Contractor rejected successfully');
      }
      
      handleReviewClose();
      // Refresh list
      fetchContractors(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      console.error("Error processing contractor:", error);
      message.error(error.response?.data?.message || "Failed to process contractor");
    } finally {
      setLoading(false);
    }
  };

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
      <Spin spinning={loading}>
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
                        <span>{contractor.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Projects */}
                    <div className="contractors-col-projects">
                      <span className="contractors-projects-count">{contractor.projects}</span>
                    </div>

                    {/* Status */}
                    <div className="contractors-col-status">
                      <span
                        className={`contractors-status-badge ${
                          contractor.status === "Active"
                            ? "contractors-status-active"
                            : "contractors-status-inactive"
                        }`}
                      >
                        {contractor.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="contractors-col-actions">
                      <Button
                        type="link"
                        icon={<MoreOutlined />}
                        onClick={() => handleReviewClick(contractor)}
                        className="contractors-action-btn"
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
      {selectedContractor && (
        <ContractorReviewModal
          open={isReviewOpen}
          contractor={selectedContractor}
          onClose={handleReviewClose}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default Contractors;

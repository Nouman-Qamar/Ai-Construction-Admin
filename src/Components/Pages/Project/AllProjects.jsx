"use client"

import { useState } from "react"
import { Eye, CheckCircle, XCircle, Calendar, DollarSign, Plus } from "lucide-react"
import { cancelProjectsData } from "./Cancel projects/cancelProjectsData"
import BidReviewModal from "./Bids overveiw/BidReviewModal"
import CancelReviewModal from "./Cancel projects/CancelReviewModal"
import Activeproject from "./active project/active"
import { Activedata } from "./active project/constant"
import PendingApproval from "./pendingapproval"
import CompleteProject from "./completeproject"
import "./AllProjects.css"

export default function AllProjects({ onProjectAdded }) {

const initialBidData = [
{ id: 1, name: "John Smith", project: "Shopping Mall Renovation - Bid 1", bid: "$2,350,000", bidAmount: 2350000, timeline: "8 months", status: "Under Review" },
{ id: 2, name: "James Brown", project: "Shopping Mall Renovation - Bid 2", bid: "$2,500,000", bidAmount: 2500000, timeline: "7 months", status: "Accepted" },
{ id: 3, name: "Ahmed Khan", project: "Office Complex Construction - Bid 3", bid: "$3,200,000", bidAmount: 3200000, timeline: "10 months", status: "Pending" },
{ id: 4, name: "Sarah Wilson", project: "Residential Building - Bid 4", bid: "$1,800,000", bidAmount: 1800000, timeline: "6 months", status: "Rejected" },
{ id: 5, name: "Mike Johnson", project: "Shopping Mall Renovation - Bid 5", bid: "$2,750,000", bidAmount: 2750000, timeline: "9 months", status: "Complete" },
]

const [activeTab, setActiveTab] = useState("bids")
const [bids, setBids] = useState(initialBidData)
const [cancelProjects, setCancelProjects] = useState(cancelProjectsData)
const [selectedItem, setSelectedItem] = useState(null)
const [isModalOpen, setIsModalOpen] = useState(false)
const [selectAll, setSelectAll] = useState(false)
const [selectedItems, setSelectedItems] = useState(new Set())
const [searchText, setSearchText] = useState("")
const [activeProjects, setActiveProjects] = useState(Activedata)

const handleSelectAll = (event) => {
const checked = event.target.checked
setSelectAll(checked)


if (checked) {
  const newSet = new Set()
  for (let item of filteredItems) {
    newSet.add(item.id)
  }
  setSelectedItems(newSet)
} else {
  setSelectedItems(new Set())
}


}

const handleSelectItem = (id) => {
const copy = new Set(selectedItems)
if (copy.has(id)) copy.delete(id)
else copy.add(id)
setSelectedItems(copy)
setSelectAll(copy.size === filteredItems.length)
}

const handleReview = (item) => {
setSelectedItem(item)
setIsModalOpen(true)
}

const handleAccept = (id) => {
if (activeTab === "bids") {
setBids(bids.map(b => b.id === id ? { ...b, status: "Accepted" } : b))
}
}

const handleReject = (id) => {
if (activeTab === "bids") {
setBids(bids.map(b => b.id === id ? { ...b, status: "Rejected" } : b))
}
}

const handleAddNewProject = () => {
if (activeTab === "bids") {
const nextId = Math.max(...bids.map(b => b.id), 0) + 1
const newBid = { id: nextId, name: "New Contractor", project: "New Project Bid", bid: "$2,000,000", bidAmount: 2000000, timeline: "6 months", status: "Pending" }
setBids([newBid, ...bids])
if (onProjectAdded) onProjectAdded()
} else if (activeTab === "cancel") {
const nextId = Math.max(...cancelProjects.map(c => c.id), 0) + 1
const newCancel = { id: nextId, name: "New Contractor", project: "New Cancel Request", bid: "$2,000,000", timeline: "6 months", status: "Pending Cancellation", reason: "New cancellation request", requestDate: new Date().toISOString().split("T")[0] }
setCancelProjects([newCancel, ...cancelProjects])
if (onProjectAdded) onProjectAdded()
}
}

let currentData = activeTab === "bids" ? bids : activeTab === "cancel" ? cancelProjects : []

const filteredItems = currentData.filter(item =>
item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
item.project?.toLowerCase().includes(searchText.toLowerCase())
)

return ( <div className="all-projects-wrapper"> <div className="all-projects-header"> <h2 className="all-projects-title">All Projects</h2>
<button onClick={handleAddNewProject} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", backgroundColor: "#f97316", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600 }}> <Plus size={18} /> Add New </button> </div>

```
  <div className="projects-tabs">
    <button className={`projects-tab ${activeTab === "bids" ? "active" : ""}`} onClick={() => { setActiveTab("bids"); setSearchText(""); setSelectedItems(new Set()); setSelectAll(false) }}><CheckCircle size={18} /> Bids Overview</button>
    <button className={`projects-tab ${activeTab === "active" ? "active" : ""}`} onClick={() => { setActiveTab("active"); setSearchText(""); setSelectedItems(new Set()); setSelectAll(false) }}><CheckCircle size={18} /> Active Projects</button>
    <button className={`projects-tab ${activeTab === "cancel" ? "active" : ""}`} onClick={() => { setActiveTab("cancel"); setSearchText(""); setSelectedItems(new Set()); setSelectAll(false) }}><XCircle size={18} /> Cancel Projects</button>
    <button className={`projects-tab ${activeTab === "pending" ? "active" : ""}`} onClick={() => { setActiveTab("pending"); setSearchText(""); setSelectedItems(new Set()); setSelectAll(false) }}><CheckCircle size={18} /> Pending Approvals</button>
    <button className={`projects-tab ${activeTab === "complete" ? "active" : ""}`} onClick={() => { setActiveTab("complete"); setSearchText(""); setSelectedItems(new Set()); setSelectAll(false) }}><CheckCircle size={18} /> Complete Projects</button>
  </div>

  <div className="projects-search-section">
    <input type="text" placeholder="Search by contractor name or project..." value={searchText} onChange={(e) => setSearchText(e.target.value)} className="projects-search-input" />
  </div>

  <div className="projects-content">
    {activeTab === "bids" || activeTab === "cancel" ? (
      <>
        <label className="projects-select-all">
          <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="projects-checkbox" />
          <span>Select all {filteredItems.length}</span>
        </label>
        {filteredItems.length === 0 ? <div className="projects-empty-state"><p>No results found</p></div> :
          filteredItems.map((item) => (
            <div key={item.id} className="projects-card">
              <div className="projects-card-left">
                <input type="checkbox" checked={selectedItems.has(item.id)} onChange={() => handleSelectItem(item.id)} className="projects-checkbox" />
                <div className="projects-avatar">{item.name?.charAt(0)}</div>
                <div className="projects-details">
                  <h3 className="projects-name">{item.name}</h3>
                  <p className="projects-project">{item.project}</p>
                  <div className="projects-info">
                    <div className="projects-info-item"><DollarSign size={18} /><span>{item.bid}</span></div>
                    <div className="projects-info-item"><Calendar size={18} /><span>{item.timeline}</span></div>
                    <span className={`projects-status projects-status-${item.status?.toLowerCase().replace(/ /g, "-")}`}>{item.status}</span>
                  </div>
                </div>
              </div>
              <div className="projects-actions">
                <button className="projects-btn projects-btn-review" onClick={() => handleReview(item)}><Eye size={18} /> Review</button>
                {activeTab === "bids" ? (
                  <>
                    <button className="projects-btn projects-btn-accept" onClick={() => handleAccept(item.id)}><CheckCircle size={18} /> Accept</button>
                    <button className="projects-btn projects-btn-reject" onClick={() => handleReject(item.id)}><XCircle size={18} /> Reject</button>
                  </>
                ) : null}
              </div>
            </div>
          ))}
      </>
    ) : activeTab === "active" ? (
      // Render Active Projects list
      (() => {
        const filteredActive = activeProjects.filter(item =>
          item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.project?.toLowerCase().includes(searchText.toLowerCase())
        )

        return filteredActive.length === 0 ? (
          <div className="projects-empty-state"><p>No active projects found</p></div>
        ) : (
          filteredActive.map((item) => (
            <div key={item.id} className="projects-card">
              <div className="projects-card-left">
                <div className="projects-avatar">{item.name?.charAt(0)}</div>
                <div className="projects-details">
                  <h3 className="projects-name">{item.name}</h3>
                  <p className="projects-project">{item.project}</p>
                  <div className="projects-info">
                    <div className="projects-info-item"><DollarSign size={18} /><span>{item.bid}</span></div>
                    <div className="projects-info-item"><Calendar size={18} /><span>{item.timeline}</span></div>
                    <span className={`projects-status projects-status-${item.status?.toLowerCase().replace(/ /g, "-")}`}>{item.status}</span>
                  </div>
                </div>
              </div>
              <div className="projects-actions">
                <button className="projects-btn projects-btn-review" onClick={() => { setSelectedItem(item); setIsModalOpen(true) }}><Eye size={18} /> Review</button>
                <button className="projects-btn projects-btn-accept" disabled><CheckCircle size={18} /> Action</button>
              </div>
            </div>
          ))
        )
      })()
    ) : activeTab === "pending" ? <PendingApproval /> :
        activeTab === "complete" ? <CompleteProject /> : null}
  </div>

  {activeTab === "bids" && <BidReviewModal isOpen={isModalOpen} bid={selectedItem} onClose={() => setIsModalOpen(false)} />}
  {activeTab === "cancel" && <CancelReviewModal isOpen={isModalOpen} project={selectedItem} onClose={() => setIsModalOpen(false)} />}
</div>


)
}

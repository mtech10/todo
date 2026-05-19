import { React, useState } from "react";
import "./sidebar.css";
import AddIcon from "@mui/icons-material/Add";
import {
  FiSearch,
  FiInbox,
  FiCalendar,
  FiGrid,
  FiActivity,
  FiChevronDown,
  FiBell,
  FiSidebar,
  FiPlus,
  FiHelpCircle,
  FiHash,
  FiCheckCircle,
} from "react-icons/fi";
import { BsCalendar4Week } from "react-icons/bs";
import { useAuth } from "../AuthContext";

const Sidebar = ({
  onClose,
  onAddTaskClick,
  searchQuery,
  setSearchQuery,
  currentView,
  setCurrentView,
}) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const { user, logout } = useAuth();
  const displayName =
    user?.username || "User";

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <div className="user-profile">
          <div className="avatar">{avatarLetter}</div>
          <span className="username">{displayName}</span>
        </div>
        <div className="header-actions">
          <FiBell className="icon action-icon" />
          <FiSidebar className="icon action-icon" onClick={onClose} />
        </div>
      </div>

      <div className="add-task-section">
        <div className="add-task-button">
          <button
            className="sidebar-add-task-btn"
            onClick={onAddTaskClick}
          >
            <AddIcon fontSize="small" />
            <span>Add task</span>
          </button>
        </div>
      </div>

      <div className="nav-menu">
        <div className="nav-item">
          <FiSearch className="nav-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div
          className={`nav-item ${currentView === "Inbox" ? "active" : ""}`}
          onClick={() => setCurrentView("Inbox")}
        >
          <FiInbox className="nav-icon active-icon" />
          <span className="active-text">Inbox</span>
        </div>
        <div
          className={`nav-item ${currentView === "Completed" ? "active" : ""}`}
          onClick={() => setCurrentView("Completed")}
        >
          <FiCheckCircle className="nav-icon" />
          <span>Completed</span>
        </div>
      </div>

      <div className="spacer"></div>

      <div className="sidebar-footer">
        <div className="nav-item footer-item">
          <div className="help-icon-wrapper">
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
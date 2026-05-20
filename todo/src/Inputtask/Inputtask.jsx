
import React, { useState, useEffect, useRef } from "react";
import {
  FiCalendar,
  FiPaperclip,
  FiFlag,
  FiClock,
  FiMoreHorizontal,
  FiInbox,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";
import { FaFlag } from "react-icons/fa";
import "../Inputtask/inputtask.css";

const Inputtask = ({ onAdd, onCancel }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(4);

  const [dueDate, setDueDate] = useState("");
  const dateInputRef = useRef(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPriorityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const priorities = [
    { level: 1, color: "#db4c3f", icon: <FaFlag color="#db4c3f" /> },
    { level: 2, color: "#eb8909", icon: <FaFlag color="#eb8909" /> },
    { level: 3, color: "#246fe0", icon: <FaFlag color="#246fe0" /> },
    { level: 4, color: "#666", icon: <FiFlag color="#666" /> },
  ];

  const getFormattedDate = () => {
    if (!dueDate) return "Date";
    const dateObj = new Date(dueDate);
    dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleSubmit = () => {
    console.log("Add Task button clicked!");
    if (!newTitle.trim()) {
      console.log("Title is empty, stopping here.");
      return;
    }

    onAdd({
      title: newTitle,
      description: newDescription,
      priority: selectedPriority,
      due_date: dueDate || null,
    });

    newTitle("");
    newDescription("");
    setDueDate("");
  };

  return (
    <div className="todo-input">
      <div className="todo-input-item">
        <input
          type="text"
          className="task-title-input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="What would you like to do?"
          autoFocus
        />

        <textarea
          className="task-desc-input"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Description"
          rows="1"
        />

        <div className="action-buttons-row">
          <div className="date-input-container">
            <button
              className={`action-btn ${dueDate ? "active" : ""}`}
              onClick={() => {
                if (dateInputRef.current && dateInputRef.current.showPicker) {
                  dateInputRef.current.showPicker();
                }
              }}
            >
              <FiCalendar /> {getFormattedDate()}
            </button>

            <input
              type="date"
              ref={dateInputRef}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="hidden-date-input"
            />
          </div>

          <div className="priority-container" ref={dropdownRef}>
            <button
              className={`action-btn ${isPriorityOpen ? "active" : ""}`}
              onClick={() => setIsPriorityOpen(!isPriorityOpen)}
            >
              <FiFlag /> Priority
            </button>

            {isPriorityOpen && (
              <div className="priority-dropdown">
                {priorities.map((p) => (
                  <div
                    key={p.level}
                    className="priority-option"
                    onClick={() => {
                      setSelectedPriority(p.level);
                      setIsPriorityOpen(false);
                    }}
                  >
                    {p.icon}
                    <span>Priority {p.level}</span>
                    {selectedPriority === p.level && (
                      <FiCheck className="check-icon" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bottom-bar">
        <div className="bottom-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="submit-btn"
            disabled={!newTitle.trim()}
            onClick={handleSubmit}
          >
            Add task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inputtask;
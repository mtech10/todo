import React, { useState, useEffect, useRef } from "react";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import DateDisplay from "../DateDisplay";
import Inputtask from "../Inputtask/Inputtask";
import Sidebar from "../Sidebar/Sidebar";
import { FiSidebar } from "react-icons/fi";
import { FaFlag } from "react-icons/fa";
import { FiFlag } from "react-icons/fi";
import axios from "axios";
import "../Home/home.css";
import { useAuth } from "../AuthContext";

const Home = () => {
  const { user, logout } = useAuth();
  const [allTodos, setAllTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("Inbox");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `https://todo-obxm.onrender.com/tasks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const allFetchedTasks = response.data;

        const activeTasks = allFetchedTasks.filter(
          (task) => task.is_complete === false,
        );
        const completedTasks = allFetchedTasks.filter(
          (task) => task.is_complete === true,
        );
        setAllTodos(activeTasks);
        setCompletedTodos(completedTasks);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };
    fetchTasks();
  }, [user]);

  const handleAddTodo = (newTodoItem) => {
    console.log("Home.jsx received:", newTodoItem);
    const token = localStorage.getItem("token");
    axios
      .post(
        "https://todo-obxm.onrender.com/new-task",
        {
          title: newTodoItem.title,
          description: newTodoItem.description,
          due_date: newTodoItem.due_date,
          priority: newTodoItem.priority,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        console.log("Server responded with:", response.data);
        setAllTodos([response.data, ...allTodos]);
        setIsInputVisible(false);
      })
      .catch((error) => {
        console.error(error.response?.data || error.message);
        alert("Failed to add task.");
      });
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const handleSaveEdit = (taskId, isCompletedList) => {
    const token = localStorage.getItem("token");

    axios
      .patch(
        `https://todo-obxm.onrender.com/edit-task/${taskId}`,
        { title: editTitle, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((response) => {
        const updatedTask = response.data;
        if (isCompletedList) {
          setCompletedTodos(
            completedTodos.map((t) => (t.id === taskId ? updatedTask : t)),
          );
        } else {
          setAllTodos(allTodos.map((t) => (t.id === taskId ? updatedTask : t)));
        }

        setEditingTaskId(null);
      })
      .catch((error) => {
        console.error(error.response?.data || error.message);
        alert("Failed to save edits.");
      });
  };

  const handleDeleteTodo = (index, isCompletedList) => {
    const token = localStorage.getItem("token");
    const taskToDelete = isCompletedList
      ? completedTodos[index]
      : allTodos[index];

    axios
      .delete(`https://todo-obxm.onrender.com/delete-task/${taskToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        if (isCompletedList) {
          let reducedTodo = [...completedTodos];
          reducedTodo.splice(index, 1);
          setCompletedTodos(reducedTodo);
        } else {
          let reducedTodo = [...allTodos];
          reducedTodo.splice(index, 1);
          setAllTodos(reducedTodo);
        }
      })
      .catch((error) => {
        console.error(error.response?.data || error.message);
        alert("Failed to delete task from server");
      });
  };

  const handleComplete = (index) => {
    const token = localStorage.getItem("token");
    const taskToComplete = allTodos[index];

    axios
      .patch(
        `https://todo-obxm.onrender.com/complete-task/${taskToComplete.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        setCompletedTodos([...completedTodos, response.data]);
        let reducedTodo = [...allTodos];
        reducedTodo.splice(index, 1);
        setAllTodos(reducedTodo);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to mark task as complete. Please try again.");
      });
  };

  const handleUncomplete = (index) => {
    const token = localStorage.getItem("token");
    const taskToUncomplete = completedTodos[index];

    axios
      .patch(
        `https://todo-obxm.onrender.com/uncomplete-task/${taskToUncomplete.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        setAllTodos([...allTodos, response.data]);
        let reducedCompleted = [...completedTodos];
        reducedCompleted.splice(index, 1);
        setCompletedTodos(reducedCompleted);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to mark task as uncomplete. Please try again.");
      });
  };

  const renderPriority = (priorityLevel) => {
    switch (priorityLevel) {
      case 1:
        return <FaFlag color="#db4c3f" className="priority-icon" />;
      case 2:
        return <FaFlag color="#eb8909" className="priority-icon" />;
      case 3:
        return <FaFlag color="#246fe0" className="priority-icon" />;
      default:
        return null;
    }
  };

  const filteredTodos = allTodos.filter((todo) => {
    const matchesTitle = todo.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDesc = todo.description
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTitle || matchesDesc;
  });

  const filteredCompletedTodos = completedTodos.filter((todo) => {
    const matchesTitle = todo.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDesc = todo.description
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTitle || matchesDesc;
  });

  return (
    <div className="home-wrapper">
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <div
        className={`sidebar-transition-wrapper ${isSidebarOpen ? "open" : "closed"}`}
      >
        <Sidebar
          onClose={() => setIsSidebarOpen(false)}
          onAddTaskClick={() => setIsInputVisible(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </div>

      <div className="main-content">
        <div className="content-wrapper">
          {!isSidebarOpen && (
            <button
              className="open-sidebar-btn"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiSidebar />
            </button>
          )}

          <h3 className="todo-header">{currentView}</h3>

          {isInputVisible ? (
            <div className="new-task-view">
              <Inputtask
                onAdd={handleAddTodo}
                onCancel={() => setIsInputVisible(false)}
              />
            </div>
          ) : (
            <div className="todo-container">
              {currentView === "Inbox" && (
                <div className="taskAdded">
                  {filteredTodos.length === 0 &&
                  filteredCompletedTodos.length === 0 ? (
                    <div className="empty-state-wrapper">
                      {searchQuery ? (
                        <p className="no-match-text">
                          No tasks match "{searchQuery}"
                        </p>
                      ) : (
                        <>
                          <img
                            src="purple-calendar.png"
                            alt="Calendar picture"
                            className="todo-header-img"
                          />
                          <div className="noTask">
                            <p className="noTask1">Capture now, plan later</p>
                            <p className="noTask2">
                              Inbox is your go-to spot for quick <br /> task
                              entry. Clear your mind now, <br /> organize when
                              you’re ready.
                            </p>
                          </div>
                          <button
                            className="add-task-btn"
                            onClick={() => setIsInputVisible(true)}
                          >
                            Add Task
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="tasks-list-wrapper">
                      {filteredTodos.map((item, index) => (
                        <div className="todo-list-item" key={item.id || index}>
                          <div className="todo-left-section">
                            <div
                              className="check-icon"
                              onClick={() => handleComplete(index)}
                            >
                              <CheckBoxOutlineBlankOutlinedIcon />
                            </div>

                            <div className="tasks-details">
                              {editingTaskId === item.id ? (
                                <div className="edit-mode-container">
                                  <input
                                    type="text"
                                    autoFocus
                                    value={editTitle}
                                    onChange={(e) =>
                                      setEditTitle(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        handleSaveEdit(item.id, false);
                                      if (e.key === "Escape")
                                        setEditingTaskId(null);
                                    }}
                                    className="invisible-input edit-title-input"
                                  />
                                  <input
                                    type="text"
                                    value={editDescription}
                                    onChange={(e) =>
                                      setEditDescription(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        handleSaveEdit(item.id, false);
                                      if (e.key === "Escape")
                                        setEditingTaskId(null);
                                    }}
                                    className="invisible-input edit-desc-input"
                                    placeholder="Add description..."
                                  />
                                </div>
                              ) : (
                                <div
                                  onClick={() => startEditing(item)}
                                  className="task-text-container"
                                >
                                  <div className="task-title-row">
                                    {renderPriority(item.priority)}
                                    <h3 className="main-text">
                                      {item.title}
                                    </h3>
                                  </div>
                                  {item.description && (
                                    <p className="small-text">
                                      {item.description}
                                    </p>
                                  )}
                                  {item.due_date && (
                                    <div className="todo-date">
                                      <DateDisplay date={item.due_date} />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="todo-right-section">
                            <div
                              className="delete-icon"
                              onClick={() => handleDeleteTodo(index, false)}
                            >
                              <DeleteOutlinedIcon />
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="add-task-wrapper">
                        <button
                          className="todo-add-btn2"
                          onClick={() => setIsInputVisible(true)}
                        >
                          <span className="plus-icon">
                            <AddIcon fontSize="small" />
                          </span>
                          Add Task
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentView === "Completed" && (
                <div className="completed-area">
                  {filteredCompletedTodos.length > 0 && (
                    <div className="completed-area">
                      <h3 className="completed-header">
                        COMPLETED ({filteredCompletedTodos.length})
                      </h3>
                      {filteredCompletedTodos.map((item, index) => (
                        <div
                          className="todo-list-item completed-item"
                          key={item.id || index}
                        >
                          <div className="todo-left-section">
                            <div className="tasks-details">
                              {editingTaskId === item.id ? (
                                <div className="edit-mode-container">
                                  <input
                                    type="text"
                                    autoFocus
                                    value={editTitle}
                                    onChange={(e) =>
                                      setEditTitle(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        handleSaveEdit(item.id, true);
                                      if (e.key === "Escape")
                                        setEditingTaskId(null);
                                    }}
                                    className="invisible-input edit-title-input edit-completed-input"
                                  />
                                  <input
                                    type="text"
                                    value={editDescription}
                                    onChange={(e) =>
                                      setEditDescription(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        handleSaveEdit(item.id, true);
                                      if (e.key === "Escape")
                                        setEditingTaskId(null);
                                    }}
                                    className="invisible-input edit-desc-input edit-completed-input"
                                  />
                                </div>
                              ) : (
                                <div
                                  onClick={() => startEditing(item)}
                                  className="task-text-container"
                                >
                                  <h3 className="main-text">
                                    {item.title}
                                  </h3>
                                  <p className="small-text">
                                    {item.description}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="todo-right-section">
                            <div
                              className="delete-icon"
                              onClick={() => handleDeleteTodo(index, true)}
                            >
                              <DeleteOutlinedIcon />
                            </div>
                            <div
                              className="check-icon"
                              onClick={() => handleUncomplete(index)}
                            >
                              <CheckBoxIcon />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
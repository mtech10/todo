import React from "react";

const DateDisplay = ({ date }) => {
  if (!date) return null;

  const taskDate = new Date(date);
  const today = new Date();
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  let displayText = "";
  let textColor = "#666";

  if (isSameDay(taskDate, today)) {
    displayText = "Today";
    textColor = "#058527";
  } else if (isSameDay(taskDate, tomorrow)) {
    displayText = "Tomorrow";
    textColor = "#ad6200"; 
  } else if (taskDate < yesterday) {
    displayText = taskDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    textColor = "#db4c3f";
  } else {
    displayText = taskDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <span style={{ color: textColor, fontSize: "13px", fontWeight: "500" }}>
      {displayText}
    </span>
  );
};

export default DateDisplay;
"use client";

import { useState, useEffect } from "react";
import { templates } from "../../lib/templates";

export default function TaskPage() {
  const [taskLists, setTaskLists] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("Portrait Session");
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [equipment, setEquipment] = useState([]);

  const fetchTasks = async () => {
    const response = await fetch("/api/tasks");
    const data = await response.json();
    setTaskLists(data);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    const selectedTemplateData = templates[template];
    setTasks(
      selectedTemplateData.tasks.map((text) => ({
        text,
        isCompleted: false,
      }))
    );
    setEquipment(selectedTemplateData.equipment);
  };

  const handleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isCompleted = !updatedTasks[index].isCompleted;
    setTasks(updatedTasks);
  };

  const saveTaskList = async () => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, sessionType: selectedTemplate, tasks, equipment }),
    });
    if (response.ok) {
      const savedList = await response.json();
      setTaskLists([...taskLists, savedList]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="task-page">
      <h1>Task Manager</h1>

      {/* Templates */}
      <div>
        <h2>Select a Template</h2>
        <select onChange={(e) => handleTemplateSelect(e.target.value)} value={selectedTemplate}>
          {Object.keys(templates).map((template) => (
            <option key={template} value={template}>
              {template}
            </option>
          ))}
        </select>
      </div>

      {/* Task Editor */}
      <div>
        <h2>Task List</h2>
        <input
          type="text"
          placeholder="Enter task list title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <h3>Tasks:</h3>
        {tasks.map((task, index) => (
          <div key={index} className={`task-item ${task.isCompleted ? "completed" : ""}`}>
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => handleTaskCompletion(index)}
            />
            <input
              type="text"
              value={task.text}
              onChange={(e) => {
                const updatedTasks = [...tasks];
                updatedTasks[index].text = e.target.value;
                setTasks(updatedTasks);
              }}
            />
          </div>
        ))}

        <h3>Equipment:</h3>
        {equipment.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              value={item}
              readOnly
            />
          </div>
        ))}
        <button onClick={saveTaskList}>Save Task List</button>
      </div>

      {/* Task List Viewer */}
      <div>
        <h2>Saved Task Lists</h2>
        {taskLists.map((list) => (
          <div key={list._id}>
            <h3>{list.title} - {list.sessionType}</h3>
            <ul>
              {list.tasks.map((task, idx) => (
                <li key={idx} className={task.isCompleted ? "completed" : ""}>
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => {
                      const updatedList = { ...list };
                      updatedList.tasks[idx].isCompleted = !updatedList.tasks[idx].isCompleted;
                      setTaskLists(taskLists.map((tl) => (tl._id === list._id ? updatedList : tl)));
                    }}
                  />
                  {task.text}
                </li>
              ))}
            </ul>

            <h4>Equipment:</h4>
            <ul>
            {Array.isArray(list.equipment) && list.equipment.length > 0 ? (
                list.equipment.map((item, idx) => (
                <li key={idx}>{item}</li>
                ))
            ) : (
                <li>No equipment specified</li>
            )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

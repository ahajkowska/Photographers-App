"use client";

import { useState, useEffect } from "react";
import { templates } from "../../lib/templates";

export default function TaskPage() {
  const [taskLists, setTaskLists] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("Portrait Session");
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [editingListId, setEditingListId] = useState(null);

  const fetchTasks = async () => {
    const response = await fetch("/api/tasks");
    const data = await response.json();
    setTaskLists(data);
  };

  const handleTemplateSelect = (template) => {
    const selectedTemplateData = templates[template];
    if (!selectedTemplateData) {
      console.error("Template not found:", template);
      setTasks([]);
      setEquipment([]);
      return;
    }

    setSelectedTemplate(template);
    setTasks(
      selectedTemplateData.tasks.map((text) => ({
        text,
        isCompleted: false,
        format: "plain",
      }))
    );
    setEquipment(selectedTemplateData.equipment || []);
  };

  const handleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isCompleted = !updatedTasks[index].isCompleted;
    setTasks(updatedTasks);
  };

  const handleTaskFormatting = (index, format) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].format = format;
    setTasks(updatedTasks);
  };

  const handleAddTask = () => {
    setTasks([...tasks, { text: "", isCompleted: false, format: "plain" }]);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleAddEquipment = () => {
    setEquipment([...equipment, ""]);
  };

  const handleDeleteEquipment = (index) => {
    const updatedEquipment = equipment.filter((_, i) => i !== index);
    setEquipment(updatedEquipment);
  };
  const saveTaskList = async () => {
    if (editingListId) {
      // update existing task list
      const response = await fetch(`/api/tasks/${editingListId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tasks, equipment }),
      });

      if (response.ok) {
        const updatedList = await response.json();
        setTaskLists(
          taskLists.map((list) =>
            list._id === editingListId ? updatedList : list
          )
        );
        setEditingListId(null); // reset editing state
      }
    } else {
      // create new task list
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, sessionType: selectedTemplate, tasks, equipment }),
      });

      if (response.ok) {
        const savedList = await response.json();
        setTaskLists([...taskLists, savedList]);
      }
    }

    // reset fields
    setTitle("");
    setTasks([]);
    setEquipment([]);
  };

  
  const editTaskList = (list) => {
    setEditingListId(list._id);
    setTitle(list.title);
    setTasks(list.tasks);
    setEquipment(list.equipment);
  };

  const deleteTaskList = async (id) => {
    const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });

    if (response.ok) {
      setTaskLists(taskLists.filter((list) => list._id !== id));
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
      <h2>{editingListId ? "Edit Task List" : "New Task List"}</h2>
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
            <div className="task-toolbar">
              <button onClick={() => handleTaskFormatting(index, "plain")}>Plain</button>
              <button onClick={() => handleTaskFormatting(index, "bullet")}>Bullet</button>
              <button onClick={() => handleTaskFormatting(index, "numbered")}>Numbered</button>
              <button onClick={() => handleDeleteTask(index)}>Delete Task</button>
            </div>
          </div>
        ))}
        <button onClick={handleAddTask}>Add Task</button>

        <h3>Equipment:</h3>
        {equipment.map((item, index) => (
          <div key={index} className="equipment-item">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const updatedEquipment = [...equipment];
                updatedEquipment[index] = e.target.value;
                setEquipment(updatedEquipment);
              }}
            />
            <button onClick={() => handleDeleteEquipment(index)}>Delete Equipment</button>
          </div>
        ))}
        <button onClick={handleAddEquipment}>Add Equipment</button>

        <button onClick={saveTaskList}>{editingListId ? "Update Task List" : "Save Task List"}</button>
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
                  <input type="checkbox" checked={task.isCompleted} readOnly />
                  <div>
                    {task.format === "bullet" && <span>•</span>}
                    {task.format === "numbered" && <span>{idx + 1}.</span>}
                    {task.text}
                  </div>
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
            <button onClick={() => editTaskList(list)}>Edit</button>
            <button onClick={() => deleteTaskList(list._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

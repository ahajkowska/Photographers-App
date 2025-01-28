"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { defaultTemplates } from "../../lib/templates";
import Link from "next/link";

export default function TaskPage() {
  const [taskLists, setTaskLists] = useState([]);
  const [templates, setTemplates] = useState([]); // custom templates
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [editingListId, setEditingListId] = useState(null);
  
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateTasks, setNewTemplateTasks] = useState([]);
  const [newTemplateEquipment, setNewTemplateEquipment] = useState([]);
  const [isTemplateEditorVisible, setIsTemplateEditorVisible] = useState(false);

  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const titleInputRef = useRef(null);

  useLayoutEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingListId]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setLoggedInUserId(userId);
      fetchTemplates();
      fetchTasks();
    }
  }, []);

  const fetchTemplates = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    try {
      const response = await fetch(`/api/templates?userId=${userId}`);
      const customTemplates = await response.json();

      // default and custom templates
      const combinedTemplates = [
        ...Object.keys(defaultTemplates).map((key) => ({
          name: key,
          tasks: defaultTemplates[key].tasks.map((text) => ({ text })),
          equipment: defaultTemplates[key].equipment.map((item) => ({ name: item })),
          isDefault: true,
        })),
        ...customTemplates,
      ];

      setTemplates(combinedTemplates);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };

  const fetchTasks = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }
    
    const response = await fetch(`/api/tasks?userId=${userId}`);
    const data = await response.json();
    setTaskLists(data);
  };

  const handleTemplateSelect = useCallback((templateName) => {
    const selectedTemplate = templates.find((t) => t.name === templateName);

    if (!selectedTemplate) {
      console.error("Template not found:", templateName);
      return;
    }

    setSelectedTemplate(templateName);
    setTasks(selectedTemplate.tasks.map((task) => ({ ...task, isCompleted: false })));
    setEquipment(selectedTemplate.equipment.map((item) => ({ ...item, isCompleted: false })));
  }, [templates]);

  const saveTemplate = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    if (!newTemplateName.trim()) {
      alert("Please enter a title!");
      return;
    }

    const newTemplate = {
      name: newTemplateName,
      tasks: newTemplateTasks.map((task) => ({ text: task.text || "" })),
      equipment: newTemplateEquipment.map((item) => ({ name: item || "" })),
      userId,
    };

    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTemplate),
      });

      if (response.ok) {
        const savedTemplate = await response.json();
        setTemplates([...templates, savedTemplate]);
        setNewTemplateName("");
        setNewTemplateTasks([]);
        setNewTemplateEquipment([]);
      } else {
        console.error("Failed to save template");
      }
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const handleTaskCompletion = useCallback((index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isCompleted = !updatedTasks[index].isCompleted;
    setTasks(updatedTasks);
  }, [tasks]);

  const handleEquipmentCompletion = useCallback((index) => {
    const updatedEquipment = [...equipment];
    updatedEquipment[index].isCompleted = !updatedEquipment[index].isCompleted;
    setEquipment(updatedEquipment);
  }, [equipment]);

  const handleAddTask = useCallback(() => {
    setTasks([...tasks, { text: "", isCompleted: false, format: "plain" }]);
  }, [tasks]);

  const handleDeleteTask = useCallback((index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  }, [tasks]);

  const handleAddEquipment = useCallback(() => {
    setEquipment([...equipment, ""]);
  }, [equipment]);

  const handleDeleteEquipment = useCallback((index) => {
    const updatedEquipment = equipment.filter((_, i) => i !== index);
    setEquipment(updatedEquipment);
  }, [equipment]);

  const saveTaskList = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a title!");
      return;
    }

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
        setEditingListId(null);
      }
    } else {
      // create new task list
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, sessionType: selectedTemplate, tasks, equipment, userId }),
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

  return (
    <div className="task-page">
      {loggedInUserId ? (
        <>
          <h1>Task Manager</h1>

          {/* Template Editor Visibility */}
          <button className="template-toggle-button" onClick={() => setIsTemplateEditorVisible(!isTemplateEditorVisible)}>
            {isTemplateEditorVisible ? "Hide Template Editor" : "Show Template Editor"}
          </button>

          {/* Create New Template */}
          {isTemplateEditorVisible && (
            <div className="template-editor">
              <h3>Create New Template</h3>
              <input
                type="text"
                placeholder="Template Title"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
              <h4>Tasks</h4>
              {newTemplateTasks.map((task, idx) => (
                <div key={idx} className="task-item">
                  <input
                    type="text"
                    value={task.text}
                    onChange={(e) => {
                      const updatedTasks = [...newTemplateTasks];
                      updatedTasks[idx].text = e.target.value;
                      setNewTemplateTasks(updatedTasks);
                    }}
                  />
                  <button onClick={() => {
                    const updatedTasks = newTemplateTasks.filter((_, i) => i !== idx);
                    setNewTemplateTasks(updatedTasks);
                  }}>Delete Task</button>
                </div>
              ))}
              <button onClick={() => setNewTemplateTasks([...newTemplateTasks, { text: "" }])}>Add Task</button>

              <h4>Equipment</h4>
              {newTemplateEquipment.map((item, idx) => (
                <div key={idx} className="equipment-item">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updatedEquipment = [...newTemplateEquipment];
                      updatedEquipment[idx] = e.target.value;
                      setNewTemplateEquipment(updatedEquipment);
                    }}
                  />
                  <button onClick={() => {
                    const updatedEquipment = newTemplateEquipment.filter((_, i) => i !== idx);
                    setNewTemplateEquipment(updatedEquipment);
                  }}>Delete Equipment</button>
                </div>
              ))}
              <div className="equipment-buttons">
                <button onClick={() => setNewTemplateEquipment([...newTemplateEquipment, ""])}>Add Equipment</button>
                <button onClick={saveTemplate}>Save Template</button>
              </div>
            </div>
          )}

          {/* Templates */}
          <div>
            <h2>Select a Template</h2>
            <select onChange={(e) => handleTemplateSelect(e.target.value)} value={selectedTemplate}>
              {templates.map((template) => (
                <option key={template.name} value={template.name}>
                  {template.isDefault ? `Default: ${template.name}` : `Custom: ${template.name}`}
                </option>
              ))}
            </select>
          </div>

          {/* Task Editor */}
          <div>
          <h2>{editingListId ? "Edit Task List" : "New Task List"}</h2>
            <input
              ref={titleInputRef}
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
                <button onClick={() => handleDeleteTask(index)}>Delete Task</button>
              </div>
            ))}
            <button className="add-task-button" onClick={handleAddTask}>Add Task</button>

            <h3>Equipment:</h3>
            {equipment.map((item, index) => (
              <div key={index} className="equipment-item">
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  onChange={() => handleEquipmentCompletion(index)}
                />
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const updatedEquipment = [...equipment];
                    updatedEquipment[index].name = e.target.value;
                    setEquipment(updatedEquipment);
                  }}
                />
                <button onClick={() => handleDeleteEquipment(index)}>Delete Equipment</button>
              </div>
            ))}
            <div className="task-buttons">
              <button className="add-equipment-button" onClick={handleAddEquipment}>Add Equipment</button>
              <button className="save-task-list-button" onClick={saveTaskList}>{editingListId ? "Update Task List" : "Save Task List"}</button>
            </div>
          </div>

          {/* Task List */}
          <div className="task-viewer">
            <h2>Saved Task Lists</h2>
            {taskLists.map((list) => (
              <div key={list._id}>
                <h3>{list.title} - {list.sessionType}</h3>
                <ul>
                  {list.tasks.map((task, idx) => (
                    <li key={idx} className={task.isCompleted ? "completed" : ""}>
                      <input type="checkbox" checked={task.isCompleted} readOnly />
                      <span>{task.text}</span>
                    </li>
                  ))}
                </ul>

                <h4>Equipment:</h4>
                <ul>
                  {Array.isArray(list.equipment) && list.equipment.length > 0 ? (
                    list.equipment.map((item, idx) => (
                      <li key={idx} className={item.isCompleted ? "completed" : ""}>
                        <input type="checkbox" checked={item.isCompleted} readOnly />
                        <span>{item.name}</span>
                      </li>
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
        </>
      ) : (
        <p>
          You must be logged in to view tasks. Please <Link href="/login">log in</Link>.
        </p>
      )}
    </div>
  );
}

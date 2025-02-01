"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import Link from "next/link";
import TemplateEditor from "../../components/TemplateEditor";
import TaskEditor from "../../components/TaskEditor";
import TaskList from "../../components/TaskList";
import useFetchTemplates from "../../hooks/useFetchTemplates";
import useFetchTasks from "../../hooks/useFetchTasks";

export default function TaskPage() {
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

  const [templates, setTemplates] = useFetchTemplates(loggedInUserId);
  const [taskLists, setTaskLists] = useFetchTasks(loggedInUserId);

  useLayoutEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingListId]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setLoggedInUserId(userId);
    }
  }, []);

  const handleTemplateSelect = useCallback((templateName) => {
    const selectedTemplate = templates.find((t) => t.name === templateName);

    if (!selectedTemplate) {
      setSelectedTemplate("");
      setTasks([]);
      setEquipment([]);
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
        setTemplates((prevTemplates) => [...prevTemplates, savedTemplate]);
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
    setEquipment([...equipment, { name: "", isCompleted: false }]);
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

    const sessionType = selectedTemplate || "Default Template";

    console.log("Selected Template:", selectedTemplate);

    if (editingListId) {
      // update existing task list
      const response = await fetch(`/api/tasks/${editingListId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tasks, equipment, sessionType}),
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
        body: JSON.stringify({ title, sessionType, tasks, equipment, userId }),
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
          <button
            className="template-toggle-button"
            onClick={() => setIsTemplateEditorVisible(!isTemplateEditorVisible)}
          >
            {isTemplateEditorVisible ? "Hide Template Editor" : "Show Template Editor"}
          </button>

          {/* Create New Template */}
          {isTemplateEditorVisible && (
            <TemplateEditor
              newTemplateName={newTemplateName}
              setNewTemplateName={setNewTemplateName}
              newTemplateTasks={newTemplateTasks}
              setNewTemplateTasks={setNewTemplateTasks}
              newTemplateEquipment={newTemplateEquipment}
              setNewTemplateEquipment={setNewTemplateEquipment}
              saveTemplate={saveTemplate}
            />
          )}

          {/* Templates */}
          <div>
            <h2>Select a Template</h2>
            <select onChange={(e) => handleTemplateSelect(e.target.value)} value={selectedTemplate}>
              <option value="">No Template</option>
              {templates.map((template, idx) => (
                <option key={`${template.name}-${idx}`} value={template.name}>
                  {template.isDefault ? `Default: ${template.name}` : `Custom: ${template.name}`}
                </option>
              ))}
            </select>
          </div>

          <TaskEditor
            title={title}
            setTitle={setTitle}
            tasks={tasks}
            setTasks={setTasks}
            equipment={equipment}
            setEquipment={setEquipment}
            handleTaskCompletion={handleTaskCompletion}
            handleAddTask={handleAddTask}
            handleDeleteTask={handleDeleteTask}
            handleEquipmentCompletion={handleEquipmentCompletion}
            handleAddEquipment={handleAddEquipment}
            handleDeleteEquipment={handleDeleteEquipment}
            saveTaskList={saveTaskList}
            editingListId={editingListId}
            titleInputRef={titleInputRef}
          />

          <TaskList
            taskLists={taskLists}
            editTaskList={editTaskList}
            deleteTaskList={deleteTaskList}
            handleTaskCompletion={handleTaskCompletion}
          />
        </>
      ) : (
        <p>
          You must be logged in to view tasks. Please <Link href="/login">log in</Link>.
        </p>
      )}
    </div>
  );
}

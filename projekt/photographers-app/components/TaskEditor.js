import React from 'react';

export default function TaskEditor({
  title,
  setTitle,
  tasks,
  setTasks,
  equipment,
  setEquipment,
  handleTaskCompletion,
  handleAddTask,
  handleDeleteTask,
  handleEquipmentCompletion,
  handleAddEquipment,
  handleDeleteEquipment,
  saveTaskList,
  editingListId,
  titleInputRef
}) {
  function onChange(event) {
    const { name, value } = event.target;

    // Assuming you're updating an object in state
    setState((prevState) => ({
        ...prevState,
        [name]: value,
    }));
  }

  return (
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
  );
}

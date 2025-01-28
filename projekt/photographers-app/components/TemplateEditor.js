import React from "react";

export default function TemplateEditor({
  newTemplateName,
  setNewTemplateName,
  newTemplateTasks,
  setNewTemplateTasks,
  newTemplateEquipment,
  setNewTemplateEquipment,
  saveTemplate,
}) {
  return (
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
          <button
            onClick={() => {
              const updatedTasks = newTemplateTasks.filter((_, i) => i !== idx);
              setNewTemplateTasks(updatedTasks);
            }}
          >
            Delete Task
          </button>
        </div>
      ))}
      <button onClick={() => setNewTemplateTasks([...newTemplateTasks, { text: "" }])}>
        Add Task
      </button>

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
          <button
            onClick={() => {
              const updatedEquipment = newTemplateEquipment.filter((_, i) => i !== idx);
              setNewTemplateEquipment(updatedEquipment);
            }}
          >
            Delete Equipment
          </button>
        </div>
      ))}
      <div className="equipment-buttons">
        <button onClick={() => setNewTemplateEquipment([...newTemplateEquipment, ""])}>
          Add Equipment
        </button>
        <button onClick={saveTemplate}>Save Template</button>
      </div>
    </div>
  );
}
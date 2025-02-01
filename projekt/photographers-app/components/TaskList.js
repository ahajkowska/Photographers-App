import React from 'react';

export default function TaskList({ taskLists, editTaskList, deleteTaskList }) {
  const handleReadOnlyClick = () => {
    alert("You must click edit to do this activity");
  };
  
  return (
    <div className="task-viewer">
      <h2>Saved Task Lists</h2>
      {taskLists.map((list) => (
        <div key={list._id}>
          <h3>{list.title} - {list.sessionType}</h3>
          <ul>
            {list.tasks.map((task, idx) => (
              <li key={idx} className={task.isCompleted ? "completed" : ""}>
                <input type="checkbox" checked={task.isCompleted} readOnly onClick={handleReadOnlyClick} />
                <span>{task.text}</span>
              </li>
            ))}
          </ul>

          <h4>Equipment:</h4>
          <ul>
            {Array.isArray(list.equipment) && list.equipment.length > 0 ? (
              list.equipment.map((item, idx) => (
                <li key={idx} className={item.isCompleted ? "completed" : ""}>
                  <input type="checkbox" checked={item.isCompleted} readOnly onClick={handleReadOnlyClick} />
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
  );
}

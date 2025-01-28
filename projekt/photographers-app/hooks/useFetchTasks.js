import { useState, useEffect } from "react";

function useFetchTasks(loggedInUserId) {
  const [taskLists, setTaskLists] = useState([]);

  useEffect(() => {
    if (!loggedInUserId) return;

    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks?userId=${loggedInUserId}`);
        const data = await response.json();
        setTaskLists(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, [loggedInUserId]);

  return [taskLists, setTaskLists];
}

export default useFetchTasks;

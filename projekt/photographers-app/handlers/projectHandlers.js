export const handleSaveProject = async (values, isEditing, currentProject, loggedInUserId, projects , setProjects, setIsEditing, setCurrentProject) => {
  try {
    if (isEditing) {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentProject._id, userId: loggedInUserId, ...values }),
      });
      const updatedProject = await response.json();
      setProjects(
        projects.map((project) =>
          project._id === updatedProject._id ? updatedProject : project
        )
      );
      setIsEditing(false);
      setCurrentProject(null);
    } else {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loggedInUserId, ...values }),
      });
      const newProject = await response.json();
      setProjects([...projects, newProject]);
    }
  } catch (error) {
    console.error("Error saving project:", error.message);
  }
};

export const handleEditProject = (project, setIsEditing, setCurrentProject) => {
  setIsEditing(true);
  setCurrentProject(project);
};

export const handleDeleteProject = async (id, loggedInUserId, setProjects, projects) => {
  try {
    const response = await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId: loggedInUserId }),
    });
    if (response.ok) {
      setProjects(projects.filter((project) => project._id !== id));
    } else {
      console.error("Failed to delete project");
    }
  } catch (error) {
    console.error("Error deleting project:", error.message);
  }
};
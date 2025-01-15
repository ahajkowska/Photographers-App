"use client"
import React, { useState } from "react";
import ProjectForm from "../../components/ProjectForm/ProjectForm";

function Projects() {
  const [projects, setProjects] = useState([]);

  const handleAddProject = (project) => {
    setProjects([...projects, project]);
  };

  return (
    <div>
      <h1>My Projects</h1>
      <ProjectForm onSubmit={handleAddProject} />
      <ul>
        {projects.map((project, index) => (
          <li key={index}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;

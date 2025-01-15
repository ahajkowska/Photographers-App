"use client";

import { useState } from "react";

export default function ProjectsPage() {
    const [projects, setProjects] = useState([
        { id: 1, name: "Portrait of a Lady", progress: "In Progress" },
        { id: 2, name: "Abstract Waves", progress: "Completed" },
    ]);

    return (
        <div>
            <h1>Projects</h1>
            <ul className="project-list">
                {projects.map((project) => (
                    <li key={project.id} className="project-card">
                    <h3>{project.name}</h3>
                    <p>Status: {project.progress}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

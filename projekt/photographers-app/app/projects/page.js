"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Tracks if a project is being edited
  const [currentProject, setCurrentProject] = useState(null); // Stores the project being edited

    // Fetch Projects from Backend
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Project title is required")
      .min(3, "Title must be at least 3 characters"),
    equipment: Yup.array()
      .of(Yup.string().required("Equipment is required"))
      .min(1, "You must add at least one piece of equipment"),
    deadlines: Yup.array()
      .of(Yup.string().required("Deadline is required"))
      .min(1, "You must add at least one deadline"),
  });

  // Save Project (Add or Update)
  const handleSaveProject = async (values) => {
    if (isEditing) {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentProject._id, ...values }),
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
        body: JSON.stringify(values),
      });
      const newProject = await response.json();
      setProjects([...projects, newProject]);
    }
  };

  // Edit Project
  const handleEditProject = (project) => {
    setIsEditing(true);
    setCurrentProject(project);
  };

  // Delete Project
  const handleDeleteProject = async (id) => {
    await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setProjects(projects.filter((project) => project._id !== id));
  };

  return (
    <div>
      <h1>Projects</h1>

      {/* Formik Form */}
      <Formik
        initialValues={
          currentProject || {
            title: "",
            equipment: [""],
            idea: "",
            deadlines: [""],
          }
        }
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          handleSaveProject(values);
          resetForm();
        }}
      >
        {({ values, errors, touched }) => (
          <Form className="project-form">
            {/* Project Title */}
            <div>
              <label htmlFor="title">Project Title</label>
              <Field
                id="title"
                name="title"
                placeholder="Enter project title"
                className={`form-field ${
                  errors.title && touched.title ? "error-field" : ""
                }`}
              />
              {errors.title && touched.title && (
                <div className="error-message">{errors.title}</div>
              )}
            </div>

            {/* Equipment Section */}
            <div>
              <label>Equipment</label>
              <FieldArray name="equipment">
                {({ push, remove }) => (
                  <div>
                    {values.equipment.map((item, index) => (
                      <div key={index} style={{ display: "flex", gap: "10px" }}>
                        <Field
                          name={`equipment[${index}]`}
                          placeholder="Enter equipment"
                          className={`form-field ${
                            errors.equipment &&
                            errors.equipment[index] &&
                            touched.equipment &&
                            touched.equipment[index]
                              ? "error-field"
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          style={{ padding: "5px 10px" }}
                        >
                          Remove
                        </button>
                        {errors.equipment &&
                          errors.equipment[index] &&
                          touched.equipment &&
                          touched.equipment[index] && (
                            <div className="error-message">
                              {errors.equipment[index]}
                            </div>
                          )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push("")}
                      style={{ marginTop: "10px" }}
                    >
                      Add Equipment
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Idea Section */}
            <div>
              <label htmlFor="idea">Project Idea</label>
              <Field
                id="idea"
                name="idea"
                placeholder="Describe your project idea (optional)"
                as="textarea"
                rows="4"
                className="form-field"
              />
            </div>

            {/* Dates and Deadlines */}
            <div>
              <label>Dates & Deadlines</label>
              <FieldArray name="deadlines">
                {({ push, remove }) => (
                  <div>
                    {values.deadlines.map((date, index) => (
                      <div key={index} style={{ display: "flex", gap: "10px" }}>
                        <Field
                          name={`deadlines[${index}]`}
                          placeholder="Enter deadline"
                          className={`form-field ${
                            errors.deadlines &&
                            errors.deadlines[index] &&
                            touched.deadlines &&
                            touched.deadlines[index]
                              ? "error-field"
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          style={{ padding: "5px 10px" }}
                        >
                          Remove
                        </button>
                        {errors.deadlines &&
                          errors.deadlines[index] &&
                          touched.deadlines &&
                          touched.deadlines[index] && (
                            <div className="error-message">
                              {errors.deadlines[index]}
                            </div>
                          )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push("")}
                      style={{ marginTop: "10px" }}
                    >
                      Add Deadline
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Submit Button */}
            <button type="submit" className="form-submit">
              {isEditing ? "Update Project" : "Add Project"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Project List */}
      <div className="project-list">
        {projects.map((project) => (
          <div key={project._id} className="project-card">
            <h3>{project.title}</h3>
            <p><strong>Equipment:</strong> {project.equipment.join(", ") || "None"}</p>
            <p><strong>Idea:</strong> {project.idea || "No idea yet"}</p>
            <p><strong>Deadlines:</strong> {project.deadlines.join(", ") || "No deadlines set"}</p>
            <div className="project-list-buttons">
              <button onClick={() => handleEditProject(project)}>Edit</button>
              <button onClick={() => handleDeleteProject(project._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

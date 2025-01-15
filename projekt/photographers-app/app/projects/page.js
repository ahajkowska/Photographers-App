"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS for react-datepicker
import Timeline from "../../components/Timeline"; // Import the Timeline component

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

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
      .of(
        Yup.object().shape({
          date: Yup.date().required("Date is required"),
          description: Yup.string().required("Description is required"),
        })
      )
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

  const handleEditProject = (project) => {
    setIsEditing(true);
    setCurrentProject(project);
  };

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
            deadlines: [{ date: null, description: "" }],
          }
        }
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          handleSaveProject(values);
          resetForm();
        }}
      >
        {({ values, setFieldValue, errors, touched }) => (
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
                          className="form-field"
                        />
                        <button type="button" onClick={() => remove(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => push("")}>
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

            {/* Dates and Deadlines Section */}
            <div>
              <label>Dates & Deadlines</label>
              <FieldArray name="deadlines">
                {({ push, remove }) => (
                  <div>
                    {values.deadlines.map((deadline, index) => (
                      <div key={index} style={{ display: "flex", gap: "10px" }}>
                        <DatePicker
                          selected={deadline.date}
                          onChange={(date) =>
                            setFieldValue(`deadlines[${index}].date`, date)
                          }
                          placeholderText="Pick a date"
                          className="form-field"
                        />
                        <Field
                          name={`deadlines[${index}].description`}
                          placeholder="What's this deadline about?"
                          className="form-field"
                        />
                        <button type="button" onClick={() => remove(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ date: null, description: "" })}
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

            {/* Render the Timeline */}
            <p><strong>Timeline:</strong></p>
            <Timeline deadlines={project.deadlines} />

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => handleEditProject(project)}>Edit</button>
              <button onClick={() => handleDeleteProject(project._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

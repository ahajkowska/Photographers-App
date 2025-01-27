"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Timeline from "../../components/Timeline";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setLoggedInUserId(userId);
    fetchProjects(userId);
  }, []);

  const fetchProjects = async (userId) => {
    try {
      const response = await fetch("/api/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userid: userId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };

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

  const handleSaveProject = async (values) => {
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

  const handleEditProject = (project) => {
    setIsEditing(true);
    setCurrentProject(project);
  };

  const handleDeleteProject = async (id) => {
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

  return (
    <div className="projects-page">
      <h1>Projects</h1>

      <Formik
        initialValues={
          currentProject || {
            title: "",
            equipment: [""],
            idea: "",
            deadlines: [{ date: null, description: "" }],
            images: [{ title: "", url: "" }],
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

            {/* Images Section */}
            <div>
              <label>Images</label>
              <FieldArray name="images">
                {({ push, remove }) => (
                  <div>
                    {values.images.map((image, index) => (
                      <div key={index} style={{ display: "flex", gap: "10px" }}>
                        <Field
                          name={`images[${index}].title`}
                          placeholder="Image Title"
                          className="form-field"
                        />
                        <Field
                          name={`images[${index}].url`}
                          placeholder="Image URL"
                          className="form-field"
                        />
                        <button type="button" onClick={() => remove(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => push({ title: "", url: "" })}>
                      Add Image
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

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

            <p><strong>Timeline:</strong></p>
            <Timeline deadlines={project.deadlines} />

            <p><strong>Images:</strong></p>
            <div className="image-cards">
              {project.images.map((image, i) => (
                <div key={i} className="image-card">
                  <img src={image.url} alt={image.title} />
                  <p>{image.title}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => handleEditProject(project)}>Edit</button>
              <button onClick={() => handleDeleteProject(project._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

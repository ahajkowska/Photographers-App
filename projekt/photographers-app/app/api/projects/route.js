import dbConnect from "../../../lib/mongodb";
import Project from "../../../models/Project";

export async function POST(req) {
  await dbConnect();
  try {
    const { userId, ...projectData } = await req.json();

    if (!userId) {
      return new Response("Unauthorized: userId is required", { status: 401 });
    }

    const newProject = await Project.create({ ...projectData, userId });
    return new Response(JSON.stringify(newProject), { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return new Response(`Failed to create project: ${error.message}`, { status: 500 });
  }
}

export async function GET(req) {
  await dbConnect();
  try {
    const userId = req.headers.get("userid");

    if (!userId) {
      return new Response("Unauthorized: userId is required", { status: 401 });
    }

    const projects = await Project.find({ userId });
    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return new Response(`Failed to fetch projects: ${error.message}`, { status: 500 });
  }
}

export async function PUT(req) {
  await dbConnect();
  try {
    const { id, userId, ...updateData } = await req.json();

    if (!userId) {
      return new Response("Unauthorized: userId is required", { status: 401 });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    );

    if (!updatedProject) {
      return new Response("Project not found or access denied", { status: 404 });
    }

    return new Response(JSON.stringify(updatedProject), { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return new Response(`Failed to update project: ${error.message}`, { status: 500 });
  }
}

export async function DELETE(req) {
  await dbConnect();
  try {
    const { id, userId } = await req.json();

    if (!userId) {
      return new Response("Unauthorized: userId is required", { status: 401 });
    }

    const deletedProject = await Project.findOneAndDelete({ _id: id, userId });

    if (!deletedProject) {
      return new Response("Project not found or access denied", { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return new Response(`Failed to delete project: ${error.message}`, { status: 500 });
  }
}

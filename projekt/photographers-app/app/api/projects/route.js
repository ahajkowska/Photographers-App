import dbConnect from "../../../lib/mongodb";
import Project from "../../../models/Project";

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const newProject = await Project.create(body);
    return new Response(JSON.stringify(newProject), { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return new Response(`Failed to create project: ${error.message}`, { status: 500 });
  }
}

export async function GET(req) {
  await dbConnect();
  try {
    const projects = await Project.find({});
    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return new Response(`Failed to fetch projects: ${error.message}`, { status: 500 });
  }
}

export async function PUT(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const updatedProject = await Project.findByIdAndUpdate(body.id, body, { new: true });
    return new Response(JSON.stringify(updatedProject), { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return new Response(`Failed to update project: ${error.message}`, { status: 500 });
  }
}

export async function DELETE(req) {
  await dbConnect();
  try {
    const { id } = await req.json();
    await Project.findByIdAndDelete(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return new Response(`Failed to delete project: ${error.message}`, { status: 500 });
  }
}

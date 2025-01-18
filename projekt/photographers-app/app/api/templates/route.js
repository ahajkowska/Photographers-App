import dbConnect from "../../../lib/mongodb";
import Template from "../../../models/Template";

export async function GET(req) {
  await dbConnect();
  
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    const templates = await Template.find({ userId });
    return new Response(JSON.stringify(templates), { status: 200 });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return new Response(`Failed to fetch templates: ${error.message}`, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  
  try {
    const { name, tasks, equipment, userId } = await req.json();

    if (!userId || !name || !tasks) {
      return new Response("Invalid input", { status: 400 });
    }

    const newTemplate = await Template.create({
      name,
      tasks,
      equipment,
      userId,
    });

    return new Response(JSON.stringify(newTemplate), { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return new Response(`Failed to create template: ${error.message}`, { status: 500 });
  }
}

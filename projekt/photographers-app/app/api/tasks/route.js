import dbConnect from "../../../lib/mongodb";
import Task from "../../../models/Task";

// create a new task list
export async function POST(req) {
  await dbConnect();

  try {
    const { title, sessionType, tasks, equipment, userId } = await req.json();

    const newTaskList = await Task.create({
      title,
      sessionType,
      tasks,
      equipment,
      userId,
    });

    return new Response(JSON.stringify(newTaskList), { status: 201 });
  } catch (error) {
    console.error("Error creating task list:", error);
    return new Response(`Failed to create task list: ${error.message}`, { status: 500 });
  }
}

// fetch all task lists
export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    const taskLists = await Task.find({ userId });
    return new Response(JSON.stringify(taskLists), { status: 200 });
  } catch (error) {
    console.error("Error fetching task lists:", error);
    return new Response(`Failed to fetch task lists: ${error.message}`, { status: 500 });
  }
}

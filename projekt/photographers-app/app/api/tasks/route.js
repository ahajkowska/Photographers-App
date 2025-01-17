import dbConnect from "../../../lib/mongodb";
import Task from "../../../models/Task";

export async function POST(req) {
  await dbConnect();

  try {
    const { title, sessionType, tasks, equipment } = await req.json();

    const newTaskList = await Task.create({
      title,
      sessionType,
      tasks,
      equipment: equipment || [],
    });

    return new Response(JSON.stringify(newTaskList), { status: 201 });
  } catch (error) {
    console.error("Error creating task list:", error);
    return new Response(`Failed to create task list: ${error.message}`, { status: 500 });
  }
}

export async function GET(req) {
  await dbConnect();

  try {
    const taskLists = await Task.find({});
    return new Response(JSON.stringify(taskLists), { status: 200 });
  } catch (error) {
    console.error("Error fetching task lists:", error);
    return new Response(`Failed to fetch task lists: ${error.message}`, { status: 500 });
  }
}

export async function PUT(req) {
  await dbConnect();

  try {
    const { id, tasks } = await req.json();
    const updatedTaskList = await Task.findByIdAndUpdate(id, { tasks }, { new: true });

    return new Response(JSON.stringify(updatedTaskList), { status: 200 });
  } catch (error) {
    console.error("Error updating task list:", error);
    return new Response(`Failed to update task list: ${error.message}`, { status: 500 });
  }
}

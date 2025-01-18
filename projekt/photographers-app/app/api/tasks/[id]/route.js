import dbConnect from "../../../../lib/mongodb";
import Task from "../../../../models/Task";

//update task list
export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const { id } = params; // Extract the task list ID from the URL
    const { title, tasks, equipment } = await req.json();

    const updatedTaskList = await Task.findByIdAndUpdate(
      id,
      { title, tasks, equipment },
      { new: true } // Return the updated document
    );

    if (!updatedTaskList) {
      return new Response("Task list not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedTaskList), { status: 200 });
  } catch (error) {
    console.error("Error updating task list:", error);
    return new Response(`Failed to update task list: ${error.message}`, { status: 500 });
  }
}

//delete task list
export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { id } = params; // Extract the task list ID from the URL

    const deletedTaskList = await Task.findByIdAndDelete(id);

    if (!deletedTaskList) {
      return new Response("Task list not found", { status: 404 });
    }

    return new Response(null, { status: 204 }); // No content
  } catch (error) {
    console.error("Error deleting task list:", error);
    return new Response(`Failed to delete task list: ${error.message}`, { status: 500 });
  }
}

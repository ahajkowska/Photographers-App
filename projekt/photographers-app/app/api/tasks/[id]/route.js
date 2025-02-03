import dbConnect from "../../../../lib/mongodb";
import Task from "../../../../models/Task";

// Update task list
export async function PUT(req, context) {
  await dbConnect();

  try {
    const { id } = await context.params; // task list ID
    const { title, tasks, equipment } = await req.json();

    if (!id || (!title && !tasks && !equipment)) {
      return new Response(
        JSON.stringify({ error: "Invalid input. ID and at least one field to update are required." }),
        { status: 400 }
      );
    }

    const updatedTaskList = await Task.findByIdAndUpdate(
      id,
      { ...(title && { title }), ...(tasks && { tasks }), ...(equipment && { equipment }) },
      { new: true }
    );

    if (!updatedTaskList) {
      return new Response(JSON.stringify({ error: "Task list not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedTaskList), { status: 200 });
  } catch (error) {
    console.error("Error updating task list:", error);
    return new Response(
      JSON.stringify({ error: `Failed to update task list: ${error.message}` }),
      { status: 500 }
    );
  }
}

// Delete task list
export async function DELETE(req, context) {
  await dbConnect();

  try {
    const { id } = await context.params;

    if (!id) {
      return new Response(JSON.stringify({ error: "Task list ID is required" }), { status: 400 });
    }

    const deletedTaskList = await Task.findByIdAndDelete(id);

    if (!deletedTaskList) {
      return new Response(JSON.stringify({ error: "Task list not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Task list deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting task list:", error);
    return new Response(
      JSON.stringify({ error: `Failed to delete task list: ${error.message}` }),
      { status: 500 }
    );
  }
}

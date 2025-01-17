import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sessionType: { type: String, required: true },
  tasks: [
    {
      text: { type: String, required: true },
      isCompleted: { type: Boolean, default: false },
    },
  ],
  equipment: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);

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
  equipment: [
    {
      name: { type: String, required: true }, // Equipment name
      isCompleted: { type: Boolean, default: false }, // Whether equipment is prepared/used
    },
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to the user
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);

import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  equipment: [{ type: String, required: true }],
  idea: { type: String },
  deadlines: [{ type: String }],
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);

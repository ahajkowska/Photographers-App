import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  equipment: [{ type: String, required: true }],
  idea: { type: String },
  deadlines: [
    {
      date: { type: Date, required: true },
      description: { type: String, required: true },
    },
  ],
  images: [
    {
      title: { type: String},
      url: { type: String},
    },
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Dodaj userId
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);

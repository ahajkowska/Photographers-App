import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tasks: [
    {
      text: { type: String, required: true },
    },
  ],
  equipment: [
    {
      name: { type: String, required: true },
    },
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Template || mongoose.model("Template", TemplateSchema);

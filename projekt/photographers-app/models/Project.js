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
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
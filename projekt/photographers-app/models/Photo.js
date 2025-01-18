import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to the user
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Photo || mongoose.model("Photo", PhotoSchema);

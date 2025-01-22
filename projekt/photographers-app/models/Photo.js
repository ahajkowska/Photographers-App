import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  username: { type: String },
  tags: { type: [String], default: [] },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      username: { type: String, required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  likes: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Photo || mongoose.model("Photo", PhotoSchema);

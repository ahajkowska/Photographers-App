import mongoose from "mongoose";

const ArtworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
});

export default mongoose.models.Artwork || mongoose.model("Artwork", ArtworkSchema);

import dbConnect from "../../../../../lib/mongodb";
import Photo from "../../../../../models/Photo";

export async function POST(req) {
  await dbConnect();

  try {
    const urlParts = new URL(req.url).pathname.split("/");
    const id = urlParts[urlParts.length - 2]; // Photo ID
    const { userId } = await req.json();

    if (!id || !userId) {
      return new Response("Invalid input", { status: 400 });
    }

    const updatedPhoto = await Photo.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId } },
      { new: true }
    ).populate("userId", "username");

    if (!updatedPhoto) {
      return new Response("Photo not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedPhoto), { status: 200 });
  } catch (error) {
    console.error("Error liking photo:", error.message);
    return new Response(`Failed to like photo: ${error.message}`, { status: 500 });
  }
}

export async function DELETE(req) {
  await dbConnect();

  try {
    const urlParts = new URL(req.url).pathname.split("/");
    const id = urlParts[urlParts.length - 2]; // Photo ID
    const { userId } = await req.json();

    if (!id || !userId) {
      return new Response("Invalid input", { status: 400 });
    }

    const updatedPhoto = await Photo.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    ).populate("userId", "username");

    if (!updatedPhoto) {
      return new Response("Photo not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedPhoto), { status: 200 });
  } catch (error) {
    console.error("Error unliking photo:", error.message);
    return new Response(`Failed to unlike photo: ${error.message}`, { status: 500 });
  }
}

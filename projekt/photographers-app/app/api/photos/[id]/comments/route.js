import dbConnect from "../../../../../lib/mongodb";
import Photo from "../../../../../models/Photo";

export async function POST(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const { userId, username, text } = await req.json();

    if (!id || !userId || !text || !username) {
      return new Response("Invalid input", { status: 400 });
    }

    // Add the comment to the photo
    const updatedPhoto = await Photo.findByIdAndUpdate(
      id,
      {
        $push: { comments: { userId, username, text, createdAt: new Date() } },
      },
      { new: true }
    );

    if (!updatedPhoto) {
      return new Response(JSON.stringify({ error: "Photo not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedPhoto), { status: 200 });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    return new Response(`Failed to add comment: ${error.message}`, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { photoId, commentId, userId } = await req.json();

    // Znajdź zdjęcie i usuń komentarz
    const updatedPhoto = await Photo.findByIdAndUpdate(
      photoId,
      {
        $pull: {
          comments: { _id: commentId, userId }, // Usuń tylko jeśli komentarz należy do użytkownika
        },
      },
      { new: true }
    );

    if (!updatedPhoto) {
      return new Response("Photo or comment not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedPhoto), { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new Response(`Failed to delete comment: ${error.message}`, { status: 500 });
  }
}
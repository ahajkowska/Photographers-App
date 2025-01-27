import dbConnect from "../../../../lib/mongodb";
import Photo from "../../../../models/Photo";


export async function POST(req, { params }) {
  await dbConnect();

  try {
    const { id } = params; // Photo ID
    const { userId, username, text } = await req.json();

    if (!id || !userId || !text || !username) {
      return new Response("Invalid input", { status: 400 });
    }

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
    console.error("Error adding comment:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
    console.log("DELETE Request Params:", params);
    await dbConnect();
  
    try {
      const { id } = params;
      console.log("Deleting photo with ID:", id);
      const deletedPhoto = await Photo.findByIdAndDelete(id);
  
      if (!deletedPhoto) {
        console.error("Photo not found for ID:", id);
        return new Response(JSON.stringify({ error: "Photo not found" }), { status: 404 });
      }
  
      console.log("Photo deleted:", deletedPhoto);
      return new Response(null, { status: 204 });
    } catch (error) {
      console.error("Error deleting photo:", error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

export async function PUT(req, { params }) {
    await dbConnect();
  
    try {
      const { id } = params;
      const { title, tags } = await req.json();
  
      if (!id ) {
        return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
      }
  
      const updatedPhoto = await Photo.findByIdAndUpdate(
        id,
        { ...(title && { title }), ...(tags && { tags }) },
        { new: true }
      );
  
      if (!updatedPhoto) {
        return new Response(JSON.stringify({ error: "Photo not found" }), { status: 404 });
      }
  
      return new Response(JSON.stringify(updatedPhoto), { status: 200 });
    } catch (error) {
      console.error("Error updating photo:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  
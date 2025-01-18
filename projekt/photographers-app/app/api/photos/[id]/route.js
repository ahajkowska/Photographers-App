import dbConnect from "../../../../lib/mongodb";
import Photo from "../../../../models/Photo";

export async function DELETE(req, { params }) {
    console.log("DELETE Request Params:", params); // Log params
    await dbConnect();
  
    try {
      const { id } = params;
      console.log("Deleting photo with ID:", id); // Log ID
      const deletedPhoto = await Photo.findByIdAndDelete(id);
  
      if (!deletedPhoto) {
        console.error("Photo not found for ID:", id); // Log not found
        return new Response(JSON.stringify({ error: "Photo not found" }), { status: 404 });
      }
  
      console.log("Photo deleted:", deletedPhoto); // Log success
      return new Response(null, { status: 204 });
    } catch (error) {
      console.error("Error deleting photo:", error.message); // Log errors
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  
  
  
  export async function PUT(req, { params }) {
    await dbConnect();
  
    try {
      const { id } = params; // Extract `id` from the request params
      const { title } = await req.json();
  
      // Validate input
      if (!id || !title) {
        return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
      }
  
      // Find and update the photo
      const updatedPhoto = await Photo.findByIdAndUpdate(
        id,
        { title },
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
  
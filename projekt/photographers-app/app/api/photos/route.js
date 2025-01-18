import dbConnect from "../../../lib/mongodb";
import Photo from "../../../models/Photo";

export async function POST(req) {
  await dbConnect();

  try {
    const { title, imageUrl, userId } = await req.json();

    if (!userId || !title || !imageUrl) {
      return new Response("Invalid input", { status: 400 });
    }

    const newPhoto = await Photo.create({ title, imageUrl, userId });
    console.log("Photo Created Successfully:", newPhoto);

    return new Response(JSON.stringify(newPhoto), { status: 201 });
  } catch (error) {
    console.error("Error creating photo:", error);
    return new Response(`Failed to create photo: ${error.message}`, { status: 500 });
  }
}

export async function GET(req) {
  await dbConnect();

  try {
    const photos = await Photo.find({});
    return new Response(JSON.stringify(photos), { status: 200 });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return new Response(`Failed to fetch photos: ${error.message}`, { status: 500 });
  }
}
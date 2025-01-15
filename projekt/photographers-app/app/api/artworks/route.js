import dbConnect from "../../../lib/mongodb";
import Artwork from "../../../models/Artwork";

export async function GET(req) {
  await dbConnect();
  const artworks = await Artwork.find({});
  return new Response(JSON.stringify(artworks), { status: 200 });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const artwork = await Artwork.create(body);
  return new Response(JSON.stringify(artwork), { status: 201 });
}

export async function DELETE(req) {
  await dbConnect();
  const { id } = await req.json();
  await Artwork.findByIdAndDelete(id);
  return new Response(null, { status: 204 });
}

export async function PUT(req) {
  await dbConnect();
  const { id, title } = await req.json();
  const updatedArtwork = await Artwork.findByIdAndUpdate(
    id,
    { title },
    { new: true } // Return the updated document
  );
  return new Response(JSON.stringify(updatedArtwork), { status: 200 });
}

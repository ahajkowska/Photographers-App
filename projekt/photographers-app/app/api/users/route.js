import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();

    // Validate input
    if (!username || !email || !password) {
      return new Response("All fields are required", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response("User already exists", { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(`Failed to register user: ${error.message}`, { status: 500 });
  }
}

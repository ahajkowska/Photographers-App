import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  await dbConnect();

  try {
    console.log("Request received:", req.body);

    const { username, email, password } = await req.json();

    console.log("Parsed data:", { username, email, password });

    if (!username || !email || !password) {
      console.log("Validation failed: Missing fields");
      return new Response("All fields are required", { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return new Response("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log("User created successfully:", newUser);
    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(`Failed to register user: ${error.message}`, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const users = await User.find({}, "userId username");

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(`Failed to fetch users: ${error.message}`, { status: 500 });
  }
}
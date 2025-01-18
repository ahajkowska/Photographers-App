import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return new Response("Email and password are required", { status: 400 });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return new Response("Invalid email or password", { status: 401 });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response("Invalid email or password", { status: 401 });
    }

    // Return the userId instead of a JWT token
    return new Response(
      JSON.stringify({ message: "Login successful", userId: user._id.toString() }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return new Response(`Login failed: ${error.message}`, { status: 500 });
  }
}

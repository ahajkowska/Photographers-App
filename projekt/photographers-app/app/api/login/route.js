import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response("Email and password are required", { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response("Invalid email or password", { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response("Invalid email or password", { status: 401 });
    }

    return new Response(
      JSON.stringify({ message: "Login successful", userId: user._id.toString(), username: user.username }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return new Response(`Login failed: ${error.message}`, { status: 500 });
  }
}

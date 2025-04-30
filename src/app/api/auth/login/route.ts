import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    await client;

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (user.status !== "approved") {
      return NextResponse.json(
        { message: "Your account is not approved yet." },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: user.id.toString(),
      email: user.email,
      streetAddress: user.streetAddress,
      role: user.role,
    });

    return NextResponse.json(
      {
        message: "Login successful.",
        token,
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          streetAddress: user.streetAddress,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}

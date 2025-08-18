import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "../../../../lib/models/User";
import { client } from "../../../../lib/mongodb";

export async function POST(req: Request) {
  try {
    const {
      firstname,
      lastname,
      streetAddress,
      phoneNumber,
      email,
      password,
      role,
    } = await req.json();

    if (
      !firstname ||
      !lastname ||
      !streetAddress ||
      !phoneNumber ||
      !email ||
      !password ||
      !role
    ) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    await client;

    if (role === "home member") {
      const normalizedEmail = email.toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
      }).collation({ locale: "en", strength: 3 });

      if (existingUser) {
        if (!existingUser.password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          existingUser.password = hashedPassword;
          await existingUser.save();

          return NextResponse.json(
            { message: "Password updated successfully." },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { message: "User already exists with a password." },
            { status: 409 }
          );
        }
      } else {
        const homeOwner = await User.findOne({
          streetAddress,
          role: "home owner",
          status: "approved",
        });

        if (!homeOwner) {
          return NextResponse.json(
            {
              message:
                "No approved home owner found for the given street address.",
            },
            { status: 404 }
          );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          firstname,
          lastname,
          streetAddress,
          phoneNumber,
          email,
          role: "home member",
          password: hashedPassword,
          ownerId: homeOwner._id,
          approvedAt: null,
          position: null,
        });

        await newUser.save();

        return NextResponse.json(
          {
            message:
              "Home member registered and associated with approved home owner.",
          },
          { status: 201 }
        );
      }
    }
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).collation({ locale: "en", strength: 3 });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      streetAddress,
      phoneNumber,
      email,
      role,
      password: hashedPassword,
      approvedAt: null,
      position: null,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "Registration successful." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Registration failed", error: error.message },
      { status: 500 }
    );
  }
}

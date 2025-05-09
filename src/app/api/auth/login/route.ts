import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/jwt";
import Dues from "@/lib/models/Dues";

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

    // const existingDue = await Dues.findOne({
    //   userId: user._id,
    //   streetAddress: user.streetAddress,
    //   dueDate: { $gt: new Date() },
    // });

    // if (!existingDue || existingDue.streetAddress !== user.streetAddress) {
    //   const dueDate = new Date();
    //   dueDate.setFullYear(dueDate.getFullYear() + 1);

    //   const latestPaidDue = await Dues.findOne({
    //     userId: user._id,
    //     paid: true,
    //     subscriptionId: { $exists: true, $ne: null },
    //   }).sort({ createdAt: -1 });

    //   await Dues.create({
    //     userId: user._id,
    //     streetAddress: user.streetAddress,
    //     amount: 300,
    //     dueDate,
    //     paymentMethod: null,
    //     autoPay: false,
    //     subscriptionId: latestPaidDue?.subscriptionId || null,
    //   });
    // }

    let dueUserId = user._id;
    let dueStreetAddress = user.streetAddress;

    if (user.role === "home member" && user.ownerId) {
      const owner = await User.findById(user.ownerId);
      if (!owner) {
        return NextResponse.json(
          { message: "Home owner not found for this member." },
          { status: 404 }
        );
      }
      dueUserId = owner._id;
      dueStreetAddress = owner.streetAddress;
    }

    const existingDue = await Dues.findOne({
      userId: dueUserId,
      dueDate: { $gt: new Date() },
    });

    if (
      user.role === "home owner" &&
      (!existingDue || existingDue.streetAddress !== dueStreetAddress)
    ) {
      const dueDate = new Date();
      dueDate.setFullYear(dueDate.getFullYear() + 1);

      const latestPaidDue = await Dues.findOne({
        userId: dueUserId,
        paid: true,
        subscriptionId: { $exists: true, $ne: null },
      }).sort({ createdAt: -1 });

      await Dues.create({
        userId: dueUserId,
        streetAddress: dueStreetAddress,
        amount: 300,
        dueDate,
        paymentMethod: null,
        autoPay: false,
        subscriptionId: latestPaidDue?.subscriptionId || null,
      });
    }

    const token = generateToken({
      id: user.id.toString(),
      email: user.email,
      streetAddress: user.streetAddress,
      role: user.role,
    });

    // return NextResponse.json(
    //   {
    //     message: "Login successful.",
    //     token,
    //     user: {
    //       id: user._id,
    //       firstname: user.firstname,
    //       lastname: user.lastname,
    //       streetAddress: user.streetAddress,
    //       email: user.email,
    //       role: user.role,
    //     },
    //   },
    //   { status: 200 }
    // );

    const userPayload: any = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      streetAddress: user.streetAddress,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
    };

    if (user.role === "home member") {
      const homeOwner = await User.findOne({
        streetAddress: user.streetAddress,
        role: "home owner",
        status: "approved",
      });

      if (homeOwner) {
        userPayload.ownerId = homeOwner._id;
      }
    }

    return NextResponse.json(
      {
        message: "Login successful.",
        token,
        user: userPayload,
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

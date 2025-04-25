import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";

// This will be a function that handles PUT requests
// export async function PUT(req: Request) {
//   try {
//     await client;

//     const authHeader = req.headers.get("authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = verifyToken(token);

//     if (!decoded || decoded.role !== "board member") {
//       return NextResponse.json(
//         { message: "Forbidden: board member only" },
//         { status: 403 }
//       );
//     }

//     const url = new URL(req.url);
//     const id = url.pathname.split("/")[3];

//     const body = await req.json();
//     const { status } = body;

//     if (!["pending", "approved", "rejected"].includes(status)) {
//       return NextResponse.json(
//         { message: "Invalid status value" },
//         { status: 400 }
//       );
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     ).select("-password");

//     if (!updatedUser) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       { message: "User status updated", user: updatedUser },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Error updating user status:", error);
//     return NextResponse.json(
//       { message: "Failed to update user status", error: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(req: Request) {
  try {
    await client;

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "board member") {
      return NextResponse.json(
        { message: "Forbidden: board member only" },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/")[3];

    const body = await req.json();
    const { status } = body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (userToUpdate.role === "home owner" && status === "approved") {
      const existingApproved = await User.findOne({
        _id: { $ne: id },
        role: "home owner",
        status: "approved",
        streetAddress: userToUpdate.streetAddress,
      });

      if (existingApproved) {
        return NextResponse.json(
          {
            message: `Another home owner from this street address is already approved.`,
          },
          { status: 409 } // Conflict
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("-password");

    return NextResponse.json(
      { message: "User status updated", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { message: "Failed to update user status", error: error.message },
      { status: 500 }
    );
  }
}

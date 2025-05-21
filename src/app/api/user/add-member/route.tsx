import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";

import crypto from "crypto";
import sendEmail from "@/lib/email/sendEmail";



// export async function POST(req: Request) {
//     try {
//         await client;

//         const authHeader = req.headers.get("authorization");
//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//         }

//         const token = authHeader.split(" ")[1];
//         const decoded = verifyToken(token);

//         if (!decoded || decoded.role !== "home owner") {
//             return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//         }

//         const data = await req.json();
//         const { firstname, lastname, email, phoneNumber, streetAddress, ownerId } = data;

//         if (!firstname || !lastname || !email || !phoneNumber || !streetAddress || !ownerId) {
//             return NextResponse.json({ message: "All fields are required" }, { status: 400 });
//         }
//         const newMember = new User({
//             firstname,
//             lastname,
//             email,
//             phoneNumber,
//             streetAddress,
//             role: "home member",
//             ownerId: ownerId,
//         });

//         await newMember.save();

//         return NextResponse.json({ message: "Member added successfully", member: newMember }, { status: 201 });

//     } catch (error: any) {
//         console.error("Add Member Error:", error);
//         return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
//     }
// }


export async function POST(req: Request) {
    try {
        await client;

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== "home owner") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const data = await req.json();
        const { firstname, lastname, email, phoneNumber, streetAddress, ownerId } = data;

        if (!firstname || !lastname || !email || !phoneNumber || !streetAddress || !ownerId) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const newMember = new User({
            firstname,
            lastname,
            email,
            phoneNumber,
            streetAddress,
            role: "home member",
            ownerId,
        });

        await newMember.save();

        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 3600000); // 1 hour

        newMember.resetToken = resetToken;
        newMember.resetTokenExpiry = expiry;
        await newMember.save();

        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/ResetPassword?token=${resetToken}`;

        const emailHTML = `
            <p>Hi ${firstname},</p>
            <p>Your account has been created. Click the link below to set your password:</p>
            <a href="${resetLink}" target="_blank" style="color: #007bff;">Set Your Password</a>
            <p>This link will expire in 1 hour.</p>
        `;

        await sendEmail(email, "Set Your Password", emailHTML);

        return NextResponse.json({ message: "Member added and reset email sent", member: newMember }, { status: 201 });

    } catch (error: any) {
        console.error("Add Member Error:", error);
        return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
    }
}

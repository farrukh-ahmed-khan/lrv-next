import { NextResponse } from "next/server";
import { client } from "../../../../lib/mongodb";
import Contact from "../../../../lib/models/Contact";

// ✅ DELETE: Remove a contact by ID
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await client;

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Contact ID is required" },
        { status: 400 }
      );
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return NextResponse.json(
        { message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Contact deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { message: "Failed to delete contact", error: error.message },
      { status: 500 }
    );
  }
}

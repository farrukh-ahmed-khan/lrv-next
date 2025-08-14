// lib/models/Nominee.ts
import mongoose, { Schema, model, models } from "mongoose";

const NomineeSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  role: { type: String, required: true }, // existing field
  email: { type: String, required: true },
  streetAddress: { type: String },
  phoneNumber: { type: String },
  year: { type: Number, required: true },
  position: { type: String, required: true }, // ✅ NEW
  addedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export default models.Nominee || model("Nominee", NomineeSchema);

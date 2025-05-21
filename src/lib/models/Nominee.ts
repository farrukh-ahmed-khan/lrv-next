import { Schema, model, models } from "mongoose";

const nomineeSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true },
    streetAddress: { type: String, required: true },
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    year: { type: Number, required: true }, 
  },
  { timestamps: true }
);

const Nominee = models.Nominee || model("Nominee", nomineeSchema);
export default Nominee;

import { Schema, model, models } from "mongoose";

const nomineeSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    year: { type: Number, required: true }, 
  },
  { timestamps: true }
);

const Nominee = models.Nominee || model("Nominee", nomineeSchema);
export default Nominee;

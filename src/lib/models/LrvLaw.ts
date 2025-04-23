import { Schema, model, models } from "mongoose";

const lrvlawSchema = new Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Lrvlaw = models.Lrvlaw || model("Lrvlaw", lrvlawSchema);

export default Lrvlaw;

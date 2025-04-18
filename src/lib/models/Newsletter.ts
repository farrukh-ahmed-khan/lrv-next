import { Schema, model, models } from "mongoose";

const newsletterSchema = new Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    year: { type: Number, required: true },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Newsletter = models.Newsletter || model("Newsletter", newsletterSchema);

export default Newsletter;

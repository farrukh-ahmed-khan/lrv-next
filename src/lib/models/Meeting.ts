import { Schema, model, models } from "mongoose";

const meetingSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Meeting = models.Meeting || model("Meeting", meetingSchema);

export default Meeting;

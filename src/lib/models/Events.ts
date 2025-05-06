import { Schema, model, models } from "mongoose";

const eventSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventname: { type: String, required: true },
    description: { type: String, default: "" },
    images: [{ type: String }], 
  },
  { timestamps: true }
);

const Event = models.Event || model("Event", eventSchema);

export default Event;

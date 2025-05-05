import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventname: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;

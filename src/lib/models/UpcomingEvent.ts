import { Schema, model, models } from "mongoose";

const upcomingEventSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // creator (board member)
    eventname: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    image: { type: String, required: true },

    // RSVP responses
    rsvps: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
          type: String,
          enum: ["attended", "not attended"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const UpcomingEvent =
  models.UpcomingEvent || model("UpcomingEvent", upcomingEventSchema);

export default UpcomingEvent;

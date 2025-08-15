import { Schema, model, models } from "mongoose";

const voteSchema = new Schema(
  {
    voter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    nominee: { type: Schema.Types.ObjectId, ref: "Nominee", required: true },
    year: { type: Number, required: true },
    position: { type: String, required: true },
  },
  { timestamps: true }
);

voteSchema.index({ voter: 1, year: 1, position: 1 }, { unique: true });

const Vote = models.Vote || model("Vote", voteSchema);
export default Vote;

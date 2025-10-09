import { Schema, model, models } from "mongoose";

const librarySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    libraryname: { type: String, required: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Library = models.Library || model("Library", librarySchema);

export default Library;

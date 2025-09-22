import { Schema, model, models } from "mongoose";

const directorsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // creator (board member)
    directorname: { type: String, required: true },
    designation: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, required: true },
   
  },
  { timestamps: true }
);

const Directors =
  models.Directors || model("Directors", directorsSchema);

export default Directors;

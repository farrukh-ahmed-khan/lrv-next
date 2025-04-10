import { Schema, model, models } from "mongoose";


const userSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function (this: any) {
        return this.role !== "home member";
      },
    },
    streetAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    status: { type: String, default: "pending" },
    role: {
      type: String,
      required: true,
      enum: ["home owner", "home member", "board member", "admin"],
      default: "admin",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function (this: any) {
        return this.role === "home member";
      },
    },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;

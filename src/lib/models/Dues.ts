import { Schema, model, models } from "mongoose";

const duesSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    streetAddress: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paid: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ["Credit Card", "PayPal", "Check"] },
    autoPay: { type: Boolean, default: false },
    transactionId: { type: String },
  },
  { timestamps: true }
);

const Dues = models.Dues || model("Dues", duesSchema);
export default Dues;

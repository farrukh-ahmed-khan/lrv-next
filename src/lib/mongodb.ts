import mongoose from "mongoose";

let clientPromise: Promise<typeof mongoose>;

if (process.env.NODE_ENV === "development") {
  let globalClient: any = global;
  if (!globalClient._mongooseClientPromise) {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined.");
    }
    globalClient._mongooseClientPromise = mongoose.connect(process.env.MONGODB_URI);
  }
  clientPromise = globalClient._mongooseClientPromise;
} else {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined.");
  }
  clientPromise = mongoose.connect(process.env.MONGODB_URI);
}

export const client = clientPromise;

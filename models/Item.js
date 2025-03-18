import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  description: String
});

export default mongoose.model("Item", itemSchema);

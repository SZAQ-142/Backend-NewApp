import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Ensure MongoDB URI is provided
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined. Check your .env file.");
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(cors({origin:"https://frontend-new-app-og7t.vercel.app"}));

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Define Mongoose Schema and Model
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

const Item = mongoose.model("Item", itemSchema);

// ✅ Default Route to Fix "Cannot GET /" Error
app.get("/", (req, res) => {
  res.send({ message: "🚀 Server is running!", api: "/api/items" });
});

// ✅ GET all items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// ✅ GET a single item by ID
app.get("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch item" });
  }
});

// ✅ POST new item
app.post("/api/items", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const newItem = new Item({ name, description });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item" });
  }
});

// ✅ UPDATE an item
app.put("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedItem) return res.status(404).json({ error: "Item not found" });

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

// ✅ DELETE an item
app.delete("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ error: "Item not found" });

    res.status(200).json({ message: "✅ Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


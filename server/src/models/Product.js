import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: { type: String, default: "Generic" },
    description: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    imageUrl: { type: String, default: " " },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ name: "text" });
productSchema.index({ category: 1 });

export default mongoose.model("Product", productSchema);

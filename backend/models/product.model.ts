import mongoose from "mongoose";
import slugify from "@sindresorhus/slugify";
import { nanoid } from "nanoid";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: { type: String, trim: true },

    soldBy: { type: String, required: true, trim: true },

    brand: { type: String, trim: true },

    audience: {
      type: String,
      enum: ["men", "women", "children"],
      required: true,
    },

    category: {
      type: String,
      enum: ["clothing", "electronics", "footwear", "beauty", "other"],
      required: true,
    },

    tags: [{ type: String, index: true }],

    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },

    stock: { type: Number, default: 0 },
    isInStock: { type: Boolean, default: true },

    images: [{ type: String }],
    thumbnail: { type: String },

    rating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// index
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: "text", description: "text" });
productSchema.index({ slug: 1 }, { unique: true });

// Pre save(.save()) hook - perform these operations before saving
productSchema.pre("save", async function (next) {
  // Generate unique slug
  if (!this.slug && this.name) {
    const cleanSlug = slugify(this.name, { lowercase: true });
    const uniqueId = nanoid(6);
    this.slug = `${cleanSlug}-${uniqueId}`;
  }
  // Calculate final price
  if (this.isModified("price") || this.isModified("discount")) {
    const discountValue =
      this.discount > 0 ? (this.price * this.discount) / 100 : 0;
    this.finalPrice = this.price - discountValue;
  }

  // Mock rating (0–5)
  if (!this.rating) {
    this.rating = parseFloat((Math.random() * 5).toFixed(1));
  }

  next();
});

// Pre 'findOneAndUpdate' hook
productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Record<string, any>;
  if (!update) return next();

  // Handle slug if name changes
  if (update.name) {
    const cleanSlug = slugify(update.name, { lowercase: true });
    const uniqueId = nanoid(6);
    update.slug = `${cleanSlug}-${uniqueId}`;
  }

  // Handle finalPrice recalculation if price or discount change
  if (update.price || update.discount) {
    const price = update.price ?? this.get("price");
    const discount = update.discount ?? this.get("discount");
    const discountValue = discount > 0 ? (price * discount) / 100 : 0;
    update.finalPrice = price - discountValue;
  }

  next();
});

const Product =
  mongoose.models.product || mongoose.model("product", productSchema);

export default Product;

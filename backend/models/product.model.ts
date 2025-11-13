import mongoose from "mongoose";
import slugify from "@sindresorhus/slugify";
import { nanoid } from "nanoid";


const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true, trim: true, unique: true },
    description: { type: String, trim: true },
    soldBy: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    audience: {
      type: String,
      enum: ["men", "women", "children", "all"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "clothing",
        "electronics",
        "footwear",
        "beauty",
        "accessories",
        "sports",
        "home",
        "books",
        "toys",
        "jewelry",
        "health",
        "automotive",
        "other",
      ],
      required: true,
    },
    tags: [{ type: String }],
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number },
    stock: { type: Number, default: 0 },
    isInStock: { type: Boolean, default: true },
    images: [{ type: String }],
    thumbnail: { type: String },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: "text", description: "text" });

productSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    const cleanSlug = slugify(this.name, { lowercase: true });
    const uniqueId = nanoid(6);
    this.slug = `${cleanSlug}-${uniqueId}`;
  }

  if (this.price != null) {
    const discount = this.discount || 0;
    const discountValue = discount > 0 ? (this.price * discount) / 100 : 0;
    this.finalPrice = this.price - discountValue;
  }

  if (!this.rating) {
    this.rating = parseFloat((Math.random() * 5).toFixed(1));
  }

  next();
});

productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Record<string, any>;

  if (update.name) {
    const cleanSlug = slugify(update.name, { lowercase: true });
    const uniqueId = nanoid(6);
    update.slug = `${cleanSlug}-${uniqueId}`;
  }

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

import { z } from "zod";

const audienceEnum = ["men", "women", "children"] as const;
const categoryEnum = [
  "clothing",
  "electronics",
  "footwear",
  "beauty",
  "other",
] as const;

const productBaseSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  soldBy: z.string().trim().min(1, "Seller information is required"),
  brand: z
    .string()
    .trim()
    .max(100, "Brand must be at most 100 characters")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  audience: z.enum(audienceEnum),
  category: z.enum(categoryEnum),
  price: z.preprocess((val) => {
    if (typeof val === "string") {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? val : parsed;
    }
    return val;
  }, z.number().positive("Price must be a positive number")),
  discount: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) return 0;
    if (typeof val === "string") {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    }
    return val;
  }, z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%").optional().default(0)),
  stock: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) return 0;
    if (typeof val === "string") {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return val;
  }, z.number().int().min(0, "Stock cannot be negative").optional().default(0)),
  tags: z
    .preprocess((val) => {
      if (!val || val === "") return undefined;
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : undefined;
        } catch {
          return undefined;
        }
      }
      return val;
    }, z.array(z.string().trim().min(1, "Tag cannot be empty").max(30, "Tag must be at most 30 characters")).max(10, "No more than 10 tags are allowed").optional())
    .optional(),
});

export const createProductSchema = productBaseSchema;

export const updateProductSchema = productBaseSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

import { z } from "zod";

const AUDIENCE_VALUES = ["men", "women", "children", "all"] as const;
const CATEGORY_VALUES = [
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
] as const;

export const audienceEnum = z.enum(AUDIENCE_VALUES);
export const categoryEnum = z.enum(CATEGORY_VALUES);

const imageFileSchema = z
  .instanceof(File, { message: "Required" })
  .refine((f) => f.size <= 5 * 1024 * 1024, { message: "Image must be <= 5MB" })
  .refine((f) => /image\/(jpeg|jpg|png|webp|avif)/.test(f.type), {
    message: "Only jpeg, jpg, png, webp , avif allowed",
  });

// Create Product Schema
export const createProductSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(800, "Description must be under 800 characters"),
  soldBy: z.string().trim().min(2, "Sold By required"),
  brand: z.string().trim().max(60).optional().or(z.literal("")),
  audience: z
    .string()
    .refine((val) => val !== "", "Please select an audience")
    .refine(
      (val) => AUDIENCE_VALUES.includes(val as typeof AUDIENCE_VALUES[number]),
      "Please select a valid audience"
    ),
  category: z
    .string()
    .refine((val) => val !== "", "Please select a category")
    .refine(
      (val) => CATEGORY_VALUES.includes(val as typeof CATEGORY_VALUES[number]),
      "Please select a valid category"
    ),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag cannot be empty")
        .max(30, "Tag must be at most 30 characters")
    )
    .default([])
    .refine((arr) => arr.length >= 1, "At least one tag is required")
    .refine((arr) => arr.length <= 10, "No more than 10 tags"),
  price: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ message: "Price is required" }).positive("Price must be positive")
  ),
  discount: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().min(0, "Discount must be >= 0").max(100, "Discount must be <= 100")
  ).default(0),
  stock: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().min(0, "Stock cannot be negative")
  ).default(0),
  thumbnail: imageFileSchema,
  images: z
    .array(imageFileSchema)
    .default([])
    .refine((arr) => arr.length >= 1, "At least one image is required")
    .refine((arr) => arr.length <= 4, "Max 4 images"),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;

// Update Product Schema - Same as create but files are optional
const optionalImageFileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= 5 * 1024 * 1024, { message: "Image must be <= 5MB" })
  .refine((f) => /image\/(jpeg|jpg|png|webp|avif)/.test(f.type), {
    message: "Only jpeg, jpg, png, webp , avif allowed",
  })
  .optional()
  .or(z.null());

export const updateProductSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(800, "Description must be under 800 characters"),
  soldBy: z.string().trim().min(2, "Sold By required"),
  brand: z.string().trim().max(60).optional().or(z.literal("")),
  audience: z
    .string()
    .refine((val) => val !== "", "Please select an audience")
    .refine(
      (val) => AUDIENCE_VALUES.includes(val as typeof AUDIENCE_VALUES[number]),
      "Please select a valid audience"
    ),
  category: z
    .string()
    .refine((val) => val !== "", "Please select a category")
    .refine(
      (val) => CATEGORY_VALUES.includes(val as typeof CATEGORY_VALUES[number]),
      "Please select a valid category"
    ),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag cannot be empty")
        .max(30, "Tag must be at most 30 characters")
    )
    .default([])
    .refine((arr) => arr.length >= 1, "At least one tag is required")
    .refine((arr) => arr.length <= 10, "No more than 10 tags"),
  price: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ message: "Price is required" }).positive("Price must be positive")
  ),
  discount: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().min(0, "Discount must be >= 0").max(100, "Discount must be <= 100")
  ).default(0),
  stock: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().min(0, "Stock cannot be negative")
  ).default(0),
  thumbnail: optionalImageFileSchema,
  images: z.array(optionalImageFileSchema).default([]).refine((arr) => arr.length <= 4, "Max 4 images"),
});

export type UpdateProductFormValues = z.infer<typeof updateProductSchema>;

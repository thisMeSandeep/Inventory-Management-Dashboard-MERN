import { uploadToCloudinary } from "@/config/cloudinary.js";
import { BadRequestError, NotFoundError } from "@/errors/httpError.js";
import Product from "@/models/product.model.js";
import User from "@/models/user.model.js";
import { CreateProductInput } from "@/validations/productvalidation.js";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

// --------------- Create a product-----------------
export const createProductService = async (
  req: Request,
  validatedData: CreateProductInput
) => {
  // get user id from req.user
  const userId = (req.user as JwtPayload).id;
  // get files from req.files
  // When using upload.fields(), files is an object with field names as keys
  if (!req.files || Array.isArray(req.files)) {
    throw new BadRequestError("Files are required");
  }
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  //   get user
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  const thumbnail = files["thumbnail"]?.[0]?.path;
  const images = (files["images"] || []).map(
    (file: Express.Multer.File) => file.path
  );

  if (!thumbnail) throw new BadRequestError("Thumbnail is required");

  //   make sure image have at least one image
  if (images.length === 0)
    throw new BadRequestError("At least one image is required");

  // Use validated data (with parsed tags) instead of raw req.body
  const {
    name,
    description,
    soldBy,
    brand,
    audience,
    category,
    tags,
    price,
    discount,
    stock,
  } = validatedData;

  // upload files to cloudinary
  const thumbnailUrl = await uploadToCloudinary(
    thumbnail,
    `products/${name}/thumbnail`
  );
  const imagesUrls = await Promise.all(
    images.map((image: string) =>
      uploadToCloudinary(image, `products/${name}/images`)
    )
  );

  // create product
  // Using new Product().save() instead of Product.create() to trigger pre-save hooks
  const product = new Product({
    userId: userId,
    name: name,
    description: description,
    soldBy: soldBy,
    brand: brand,
    audience: audience,
    category: category,
    tags: tags || [],
    price: price,
    discount: discount || 0,
    stock: stock || 0,
    thumbnail: thumbnailUrl,
    images: imagesUrls,
  });

  await product.save();

  return product;
};

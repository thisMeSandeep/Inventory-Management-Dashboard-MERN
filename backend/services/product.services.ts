import { uploadToCloudinary } from "@/config/cloudinary.js";
import { BadRequestError, NotFoundError } from "@/errors/httpError.js";
import Product from "@/models/product.model.js";
import User from "@/models/user.model.js";
import { CreateProductInput } from "@/validations/productValidation.js";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { io } from "@/server.js";

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

  const thumbnail = files["thumbnail"]?.[0]?.buffer;
  const images = (files["images"] || []).map(
    (file: Express.Multer.File) => file.buffer
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
    images.map((image: Buffer) =>
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

  io.emit("product:create", `${user.name} added a new product`);

  return product;
};

// --------------- Get all products-----------------
// ---------------- Pagination , Filtering and Sorting ----------------
// ------------------ Filtering - based on category, price range, tag -----------------
// ------------------ Sorting - based on price, rating -----------------
// ------------------ Pagination - limit and skip -----------------
export const getAllProductsService = async (req: Request) => {
  const {
    page = 1,
    limit = 10,
    category,
    minPrice,
    maxPrice,
    tag,
    sortBy,
  } = req.query;

  const filter: any = {};

  if (category) filter.category = category;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (tag) filter.tags = tag;

  const sort = sortBy ? (sortBy as string).split(",").join(" ") : undefined;

  const skip = (Number(page) - 1) * Number(limit);

  // get products
  let query = Product.find(filter);

  if (sort) {
    query = query.sort(sort);
  }

  const products = await query.skip(skip).limit(Number(limit));

  // get total count
  const totalProducts = await Product.countDocuments(filter);

  // calculate total pages
  const totalPages = Math.ceil(totalProducts / Number(limit));

  return {
    products,
    pagination: {
      totalProducts,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit),
    },
  };
};

// --------------- Update a product-----------------

export const updateProductService = async (
  userId: string,
  slug: string,
  validatedData: Partial<CreateProductInput>,
  req: Request
) => {
  // check if user exists
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  // check if product exists
  const product = await Product.findOne({ slug });
  if (!product) throw new NotFoundError("Product not found");

  // Prepare update data with only validated text fields
  const updateData: any = { ...validatedData };

  // Explicitly delete slug to prevent it from being updated
  // This allows name to be updated while keeping slug immutable
  delete updateData.slug;

  // Handle files separately
  if (req.files && !Array.isArray(req.files)) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // handle thumbnail update
    if (files["thumbnail"] && files["thumbnail"][0]) {
      const thumbnail = files["thumbnail"][0].buffer;
      const thumbnailUrl = await uploadToCloudinary(
        thumbnail,
        `products/${validatedData.name || product.name}/thumbnail`
      );
      updateData.thumbnail = thumbnailUrl;
    }

    // handle images update
    if (files["images"] && files["images"].length > 0) {
      const images = files["images"].map(
        (file: Express.Multer.File) => file.buffer
      );
      const imagesUrls = await Promise.all(
        images.map((image: Buffer) =>
          uploadToCloudinary(image, `products/${validatedData.name || product.name}/images`)
        )
      );
      updateData.images = imagesUrls;
    }
  }

  // update product - findOneAndUpdate bypasses pre-save hooks
  const updatedProduct = await Product.findOneAndUpdate({ slug }, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) throw new NotFoundError("Product not found");

  io.emit("product:update", `${user.name} updated a product`);

  return updatedProduct;
};

// --------------- Delete a product-----------------
export const deleteProductService = async (userId: string, slug: string) => {
  // check if user exists
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  // check if product exists
  const product = await Product.findOne({ slug });
  if (!product) throw new NotFoundError("Product not found");

  // delete product
  const deletedProduct = await Product.findOneAndDelete({ slug });

  io.emit("product:delete", `${user.name} deleted a product`);

  return deletedProduct;
};

// --------------- Get a single product-----------------
export const getProductService = async (slug: string) => {
  // check if product exists
  const product = await Product.findOne({ slug });
  if (!product) throw new NotFoundError("Product not found");
  return product;
};

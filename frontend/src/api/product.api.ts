import axiosInstance from "../lib/axios";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  ProductsResponse,
  ProductResponse,
} from "../types/product.types";

// --------------------create product------------------
export const createProduct = (data: CreateProductInput) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("soldBy", data.soldBy);
  formData.append("audience", data.audience);
  formData.append("category", data.category);
  formData.append("price", String(data.price));
  if (data.description) formData.append("description", data.description);
  if (data.brand) formData.append("brand", data.brand);
  if (data.discount !== undefined)
    formData.append("discount", String(data.discount));
  if (data.stock !== undefined) formData.append("stock", String(data.stock));
  if (data.tags && data.tags.length) {
    // Append tags individually; adjust if backend expects different format
    data.tags.forEach((tag) => formData.append("tags", tag));
  }
  formData.append("thumbnail", data.thumbnail);
  data.images.forEach((file) => formData.append("images", file));
  return axiosInstance.post<ProductResponse>("/product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// --------------------update product------------------
export const updateProduct = (slug: string, data: UpdateProductInput) => {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.soldBy) formData.append("soldBy", data.soldBy);
  if (data.audience) formData.append("audience", data.audience);
  if (data.category) formData.append("category", data.category);
  if (data.price !== undefined) formData.append("price", String(data.price));
  if (data.description) formData.append("description", data.description);
  if (data.brand) formData.append("brand", data.brand);
  if (data.discount !== undefined)
    formData.append("discount", String(data.discount));
  if (data.stock !== undefined) formData.append("stock", String(data.stock));
  if (data.tags && data.tags.length) {
    data.tags.forEach((tag) => formData.append("tags", tag));
  }
  if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
  if (data.images && data.images.length) {
    data.images.forEach((file) => formData.append("images", file));
  }
  return axiosInstance.put<ProductResponse>(`/product/${slug}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// --------------------get all products------------------
export const getProducts = (filters?: ProductFilters) => {
  return axiosInstance.get<ProductsResponse>("/products", {
    params: filters,
  });
};

// --------------------get single product------------------
export const getProduct = (slug: string) => {
  return axiosInstance.get<ProductResponse>(`/product/${slug}`);
};

// --------------------delete product------------------
export const deleteProduct = (slug: string) => {
  return axiosInstance.delete<ProductResponse>(`/product/${slug}`);
};

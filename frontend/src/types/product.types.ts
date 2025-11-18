export type Audience = "men" | "women" | "children" | "all";

export type Category =
  | "clothing"
  | "electronics"
  | "footwear"
  | "beauty"
  | "accessories"
  | "sports"
  | "home"
  | "books"
  | "toys"
  | "jewelry"
  | "health"
  | "automotive"
  | "other";

export interface Product {
  _id: string;
  userId: string;
  name: string;
  slug: string;
  description?: string;
  soldBy: string;
  brand?: string;
  audience: Audience;
  category: Category;
  tags: string[];
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  isInStock: boolean;
  images: string[];
  thumbnail: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  soldBy: string;
  brand?: string;
  audience: Audience;
  category: Category;
  tags?: string[];
  price: number;
  discount?: number;
  stock?: number;
  thumbnail: File;
  images: File[];
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  soldBy?: string;
  brand?: string;
  audience?: Audience;
  category?: Category;
  tags?: string[];
  price?: number;
  discount?: number;
  stock?: number;
  thumbnail?: File;
  images?: File[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  tag?: string;
  sortBy?: string;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  products: Product[];
  pagination: {
    totalProducts: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

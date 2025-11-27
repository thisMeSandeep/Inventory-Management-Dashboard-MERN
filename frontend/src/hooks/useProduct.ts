import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/product.api";
import type {
  ProductFilters,
  ProductsResponse,
  Product,
  ProductResponse,
  CreateProductInput,
  UpdateProductInput,
} from "../types/product.types";
import type {
  CreateProductFormValues,
  UpdateProductFormValues,
} from "../schemas/productSchemas";
import { queryClient } from "../lib/queryClient";
import { toast } from "react-toastify";

//fetch all products with optional filters
export const useProducts = (filters?: ProductFilters) => {
  return useQuery<ProductsResponse, Error>({
    queryKey: ["products", filters || {}],
    queryFn: async () => {
      const response = await getProducts(filters);
      return response.data; // ProductsResponse
    },
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev as ProductsResponse | undefined,
    refetchOnWindowFocus: false,
  });
};

// Convenience selector returning normalized values
export const useProductList = (filters?: ProductFilters) => {
  const query = useProducts(filters);
  const data = query.data as ProductsResponse | undefined;
  return {
    products: data?.products as Product[] | undefined,
    pagination: data?.pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};

// Mutation Create Product
export const useCreateProduct = () => {
  return useMutation<ProductResponse, Error, CreateProductFormValues>({
    mutationFn: async (values: CreateProductFormValues) => {
      const res = await createProduct(values as unknown as CreateProductInput);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create product";
      toast.error(message);
    },
  });
};

// Fetch single product by slug
export const useProduct = (slug: string) => {
  return useQuery<Product, Error>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await getProduct(slug);
      return response.data.data;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!slug,
  });
};

// Update product by slug
export const useUpdateProduct = () => {
  return useMutation<
    ProductResponse,
    Error,
    { slug: string; data: UpdateProductFormValues }
  >({
    mutationFn: async ({ slug, data }) => {
      const res = await updateProduct(
        slug,
        data as unknown as UpdateProductInput
      );
      return res.data;
    },
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
      toast.success("Product updated successfully");
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update product";
      toast.error(message);
    },
  });
};

// Delete product by slug
export const useDeleteProduct = () => {
  return useMutation<ProductResponse, Error, string>({
    mutationFn: async (slug: string) => {
      const res = await deleteProduct(slug);
      return res.data;
    },
    onSuccess: (data, slug) => {
      toast.success(data.message || "Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // Invalidate this product detail cache specifically
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete product";
      toast.error(message);
    },
  });
};

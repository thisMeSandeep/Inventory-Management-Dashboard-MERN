import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/product.api";
import type { ProductFilters, ProductsResponse, Product } from "../types/product.types";


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


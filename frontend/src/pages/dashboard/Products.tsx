import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { ProductFilters } from "../../types/product.types";
import { useProductList } from "../../hooks/useProduct";
import ProductsToolbar from "../../components/products/ProductsToolbar.tsx";
import ProductList from "../../components/products/ProductList.tsx";
import ProductSkeleton from "../../components/products/ProductSkeleton.tsx";
import Pagination from "../../components/products/Pagination.tsx";
import Sidebar from "../../components/products/Sidebar.tsx";
import { useSocketContext } from "../../contexts/SocketContext";
import { toast } from "react-toastify";
import { queryClient } from "../../lib/queryClient.ts";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { socket } = useSocketContext();

  // Parse filters from URL params
  const filters = useMemo<ProductFilters>(() => {
    const category = searchParams.get("category");
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 12,
      category: category ? (category as ProductFilters["category"]) : undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      tag: searchParams.get("tag") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
    };
  }, [searchParams]);


  // Update filters in URL params
  function updateFilters(partial: Partial<ProductFilters>, opts: { keepPage?: boolean } = {}) {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      // Update or remove each filter
      Object.entries(partial).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          newParams.set(key, String(value));
        } else {
          newParams.delete(key);
        }
      });
      // Reset to page 1 if filters changed (except when explicitly keeping page)
      if (!opts.keepPage && Object.keys(partial).some((k) => k !== "page")) {
        newParams.set("page", "1");
      }

      return newParams;
    });
  }

  function clearFilters() {
    setSearchParams({ page: "1", limit: String(filters.limit) });
  }

  // Fetch products with current filters
  const { products, pagination, isLoading, error, refetch } = useProductList(filters);

  // Listen for real-time product events
  useEffect(() => {

    // reftech data if any product is created or deleted
    const refresh = () => {
      if (refetch) {
        refetch();
      } else {
        queryClient.invalidateQueries({ queryKey: ["products", filters] });
      }
    };

    const handleProductCreate = (message: string) => {
      toast.success(message);
      refresh();
    };

    const handleProductDelete = (message: string) => {
      toast.info(message);
      refresh();
    };

    socket.on("product:create", handleProductCreate);
    socket.on("product:delete", handleProductDelete);

    return () => {
      socket.off("product:create", handleProductCreate);
      socket.off("product:delete", handleProductDelete);
    };
  }, [socket, filters, refetch]);

  return (
    <div className="flex gap-6 items-start relative">

      {/*Filter Sidebar */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onClear={clearFilters}
        filters={filters}
        onFiltersChange={updateFilters}
      />

      <main className="flex-1 flex flex-col min-h-[calc(100dvh-120px)]">

        {/* Products Toolbar */}
        <ProductsToolbar
          filters={filters}
          onFiltersChange={updateFilters}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        {/* Product List */}
        {isLoading ? (
          <ProductSkeleton count={filters.limit} />
        ) : error ? (
          <div className="text-center py-12 text-neutral-600">
            <p>Failed to load products. Please try again.</p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-12 text-neutral-600">
            <p>No products found.</p>
          </div>
        ) : (
          <ProductList products={products} />
        )}

        {/* Pagination */}
        <div className="mt-8">
          <Pagination
            currentPage={filters.page || 1}
            totalPages={pagination?.totalPages || 1}
            onPageChange={(p: number) => updateFilters({ page: p }, { keepPage: true })}
          />
        </div>
      </main>
    </div>
  );
};

export default Products;
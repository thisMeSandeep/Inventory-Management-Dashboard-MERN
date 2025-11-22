import { useState } from "react";
import type { ProductFilters } from "../../types/product.types";
import ProductsToolbar from "../../components/products/ProductsToolbar.tsx";
import ProductList from "../../components/products/ProductList.tsx";
import Pagination from "../../components/products/Pagination.tsx";
import Sidebar from "../../components/products/Sidebar.tsx";

const Products = () => {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    tag: undefined,
    sortBy: undefined,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  function updateFilters(partial: Partial<ProductFilters>, opts: { keepPage?: boolean } = {}) {
    setFilters((prev) => {
      const next = { ...prev, ...partial };
      if (!opts.keepPage && Object.keys(partial).some((k) => k !== "page")) {
        next.page = 1;
      }
      return next;
    });
  }

  function clearFilters() {
    setFilters((prev) => ({ page: 1, limit: prev.limit }));
  }

  return (
    <div className="flex gap-6 items-start relative">

      {/*Filter Sidebar */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onClear={clearFilters}
      />

      <main className="flex-1 flex flex-col min-h-[calc(100dvh-120px)]">

        {/* Products Toolbar */}
        <ProductsToolbar
          filters={filters}
          onFiltersChange={updateFilters}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        {/* Product List */}
        <ProductList />

        {/* Pagination */}
        <div className="mt-8">
          <Pagination
            currentPage={filters.page || 1}
            totalPages={5}
            onPageChange={(p: number) => updateFilters({ page: p }, { keepPage: true })}
          />
        </div>
      </main>
    </div>
  );
};

export default Products;
import { Filter } from "lucide-react";
import type { ProductFilters } from "../../types/product.types";

interface ProductsToolbarProps {
    filters: ProductFilters;
    onFiltersChange: (partial: Partial<ProductFilters>) => void;
    onOpenSidebar: () => void;
}

const ProductsToolbar = ({ filters, onFiltersChange, onOpenSidebar }: ProductsToolbarProps) => {
    return (
        <header className="mb-6 w-full bg-white border border-neutral-200 rounded-sm p-4 flex flex-wrap gap-4 items-center">
            {/* Mobile filter trigger */}
            <button
                onClick={onOpenSidebar}
                className="md:hidden inline-flex items-center gap-1 rounded-sm border border-neutral-200 px-3 py-1.5 text-sm bg-white hover:bg-neutral-100"
            >
                <Filter className="h-4 w-4" /> Filters
            </button>

            {/* Sort */}
            <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-neutral-600">Sort</label>
                <select
                    value={filters.sortBy || ""}
                    onChange={(e) => onFiltersChange({ sortBy: e.target.value || undefined })}
                    className="text-sm rounded-sm border border-neutral-200 bg-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-black"
                >
                    <option value="">Default</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="-rating">Rating: High to Low</option>
                    <option value="createdAt">Newest</option>
                </select>
            </div>

            {/* Limit */}
            <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-neutral-600">Limit</label>
                <select
                    value={filters.limit || 12}
                    onChange={(e) => onFiltersChange({ limit: Number(e.target.value) })}
                    className="text-sm rounded-sm border border-neutral-200 bg-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-black"
                >
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                </select>
            </div>

            {/* Page indicator  */}
            <div className="ml-auto text-xs text-neutral-600">
                Page {filters.page}
            </div>
        </header>
    );
};

export default ProductsToolbar;

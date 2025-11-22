import type { Category } from "../../types/product.types";

const categories: { value: Category; label: string }[] = [
    { value: "clothing", label: "Clothing" },
    { value: "electronics", label: "Electronics" },
    { value: "footwear", label: "Footwear" },
    { value: "beauty", label: "Beauty" },
    { value: "accessories", label: "Accessories" },
    { value: "sports", label: "Sports" },
    { value: "home", label: "Home" },
    { value: "books", label: "Books" },
    { value: "toys", label: "Toys" },
    { value: "jewelry", label: "Jewelry" },
    { value: "health", label: "Health" },
    { value: "automotive", label: "Automotive" },
    { value: "other", label: "Other" },
];

const FilteringUI = () => {
    return (
        <div className="space-y-6">
            {/* Category Filtering */}
            <div>
                <label className="block text-xs font-semibold text-black mb-2">Category</label>
                <select className="w-full text-sm rounded-sm border border-neutral-200 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black">
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Min and Max Price Filtering */}
            <div>
                <label className="block text-xs font-semibold text-black mb-2">Price Range</label>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full text-sm rounded-sm border border-neutral-200 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <span className="text-xs text-neutral-600">—</span>
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full text-sm rounded-sm border border-neutral-200 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                </div>
            </div>
        </div>
    );
};

export default FilteringUI;
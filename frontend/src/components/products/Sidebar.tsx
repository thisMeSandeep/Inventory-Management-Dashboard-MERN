import { Filter, X } from "lucide-react";
import FilteringUI from "./FilteringUI.tsx";
import type { ProductFilters } from "../../types/product.types";

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
    onClear?: () => void;
    filters: ProductFilters;
    onFiltersChange: (partial: Partial<ProductFilters>) => void;
}

const Sidebar = ({ mobileOpen, onClose, onClear, filters, onFiltersChange }: SidebarProps) => {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-[260px] shrink-0 bg-white border border-neutral-200 rounded-sm p-5 h-fit ">
                <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-black">
                    <Filter className="h-4 w-4" /> Filters
                </h2>
                <div className="space-y-6">
                    <FilteringUI filters={filters} onFiltersChange={onFiltersChange} />
                    <button
                        onClick={onClear}
                        className="text-xs text-neutral-600 hover:text-black underline cursor-pointer"
                    >
                        Clear All
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Drawer */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-40 flex">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={onClose}
                    />
                    <aside className="relative z-50 w-72 max-w-[80%] h-full bg-white border-r border-neutral-200 p-5 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold flex items-center gap-2 text-black">
                                <Filter className="h-4 w-4" /> Filters
                            </h2>
                            <button
                                aria-label="Close filters"
                                onClick={onClose}
                                className="p-1 rounded hover:bg-neutral-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-6">
                            <FilteringUI filters={filters} onFiltersChange={onFiltersChange} />
                        </div>
                        <div className="pt-4 mt-4 border-t border-neutral-200 flex gap-2">
                            <button
                                onClick={onClear}
                                className="text-xs underline text-neutral-600 hover:text-black"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={onClose}
                                className="ml-auto text-xs px-3 py-1 rounded bg-black text-white"
                            >
                                Done
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
};

export default Sidebar;
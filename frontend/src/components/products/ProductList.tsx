import { Link } from "react-router-dom";
import type { Product } from "../../types/product.types";

interface ProductListProps {
    products: Product[];
    onSelect?: (product: Product) => void;
}

const ProductList = ({ products, onSelect }: ProductListProps) => {
    return (
        <section>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {products.map((product) => (
                    <Link
                        key={product._id}
                        to={`/products/${product.slug}`}
                        onClick={() => onSelect?.(product)}
                        className="group cursor-pointer relative rounded-sm border border-neutral-200 bg-white p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="aspect-square w-full mb-3 rounded-sm bg-neutral-100 overflow-hidden flex items-center justify-center">
                            {product.thumbnail ? (
                                <img
                                    src={product.thumbnail}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="text-xs text-neutral-500">No Image</div>
                            )}
                        </div>
                        <h3 className="text-sm font-medium text-black mb-1 line-clamp-2">{product.name}</h3>
                        <p className="text-xs text-neutral-600 mb-2 capitalize">{product.category}</p>
                        <div className="mt-auto flex justify-between items-end">
                            <div className="flex flex-col">
                                {product.discount > 0 && (
                                    <span className="text-xs text-neutral-500 line-through">${product.price}</span>
                                )}
                                <span className="text-sm font-semibold text-black">${product.finalPrice}</span>
                            </div>
                            <span className="text-xs text-neutral-600">★ {product.rating}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default ProductList;

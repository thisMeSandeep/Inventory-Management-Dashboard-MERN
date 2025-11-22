import { Star, Package, Tag, Users, Calendar, TrendingUp } from 'lucide-react';
import type { Product } from '../../types/product.types';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const discountPercentage = product.discount;
  const hasDiscount = discountPercentage > 0;

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>
        {product.brand && (
          <p className="text-lg text-neutral-600 mt-1">by {product.brand}</p>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${
                index < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-neutral-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-neutral-600">
          {product.rating.toFixed(1)} out of 5
        </span>
      </div>

      {/* Price Section */}
      <div className="border-y border-neutral-200 py-4">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-neutral-900">
            {formatPrice(product.finalPrice)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-2xl text-neutral-400 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                {discountPercentage}% OFF
              </span>
            </>
          )}
        </div>
        {hasDiscount && (
          <p className="text-sm text-green-600 mt-2">
            You save {formatPrice(product.price - product.finalPrice)}
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <Package
          className={`w-5 h-5 ${
            product.isInStock ? 'text-green-600' : 'text-red-600'
          }`}
        />
        <span
          className={`font-medium ${
            product.isInStock ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {product.isInStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
        </span>
      </div>

      {/* Description */}
      {product.description && (
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Description
          </h2>
          <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}

      {/* Product Details Grid */}
      <div className="bg-neutral-50 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Product Details
        </h2>

        <div className="grid gap-4">
          {/* Category */}
          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-neutral-600 mt-0.5" />
            <div>
              <p className="text-sm text-neutral-500">Category</p>
              <p className="font-medium text-neutral-900 capitalize">
                {product.category}
              </p>
            </div>
          </div>

          {/* Audience */}
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-neutral-600 mt-0.5" />
            <div>
              <p className="text-sm text-neutral-500">Target Audience</p>
              <p className="font-medium text-neutral-900 capitalize">
                {product.audience}
              </p>
            </div>
          </div>

          {/* Sold By */}
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-neutral-600 mt-0.5" />
            <div>
              <p className="text-sm text-neutral-500">Sold By</p>
              <p className="font-medium text-neutral-900">{product.soldBy}</p>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-neutral-600 mt-0.5" />
            <div>
              <p className="text-sm text-neutral-500">Listed On</p>
              <p className="font-medium text-neutral-900">
                {formatDate(product.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-3">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm hover:bg-neutral-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="text-xs text-neutral-500 pt-4 border-t border-neutral-200">
        <p>Product ID: {product._id}</p>
        <p>Last Updated: {formatDate(product.updatedAt)}</p>
      </div>
    </div>
  );
};

export default ProductInfo;

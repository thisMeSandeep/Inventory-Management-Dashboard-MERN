import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useProduct } from '../../hooks/useProduct';
import ProductImageGallery from '../../components/products/ProductImageGallery';
import ProductInfo from '../../components/products/ProductInfo';
import Button from '../../components/UI/Button';

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-neutral-600 mb-6">
            {error.message || 'The product you are looking for does not exist or has been removed.'}
          </p>
          <Link to="/products">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            No Product Data
          </h2>
          <p className="text-neutral-600 mb-6">
            Unable to load product information at this time.
          </p>
          <Link to="/products">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </Link>

      {/* Product Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column - Images */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <ProductImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column - Product Info */}
        <div>
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
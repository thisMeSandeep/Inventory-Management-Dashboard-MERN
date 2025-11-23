import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Trash2, Edit } from 'lucide-react';
import { useProduct, useDeleteProduct } from '../../hooks/useProduct';
import ProductImageGallery from '../../components/products/ProductImageGallery';
import ProductInfo from '../../components/products/ProductInfo';
import Button from '../../components/UI/Button';

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(slug || '');
  const deleteMutation = useDeleteProduct();

  const handleDelete = () => {
    if (!product) return;
    const ok = window.confirm(
      'Are you sure you want to delete this product? This action cannot be undone.'
    );
    if (!ok) return;
    deleteMutation.mutate(product.slug, {
      onSuccess: () => {
        navigate('/products');
      },
    });
  };

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

      {/* Danger Zone */}
      <div className="mt-10 border-t border-neutral-200 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Actions</h3>
            <p className="text-sm text-neutral-600">Edit or delete this product.</p>
          </div>
          <div className="flex gap-3">
            <Link to={`/products/${product.slug}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" /> Edit Product
              </Button>
            </Link>
            <Button
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-600"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
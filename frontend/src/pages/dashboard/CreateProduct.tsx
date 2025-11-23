import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, updateProductSchema, type CreateProductFormValues, audienceEnum, categoryEnum } from "../../schemas/productSchemas";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { useState, useEffect } from "react";
import { useCreateProduct, useUpdateProduct, useProduct } from "../../hooks/useProduct";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { X, Loader2 } from "lucide-react";

const CreateProduct = () => {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const isEditMode = !!slug;
    
    const { mutateAsync: createMutate, isPending: isCreating } = useCreateProduct();
    const { mutateAsync: updateMutate, isPending: isUpdating } = useUpdateProduct();
    const { data: existingProduct, isLoading: isLoadingProduct } = useProduct(slug || "");
    
    const [tagValue, setTagValue] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [imagesPreview, setImagesPreview] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(isEditMode ? updateProductSchema : createProductSchema),
        mode: "onSubmit",
        defaultValues: {
            discount: 0,
            stock: 0,
        },
    });

    const tags = watch("tags") || [];

    // Prepopulate form when in edit mode
    useEffect(() => {
        if (isEditMode && existingProduct) {
            // Set text fields
            reset({
                name: existingProduct.name,
                description: existingProduct.description || "",
                soldBy: existingProduct.soldBy,
                brand: existingProduct.brand || "",
                audience: existingProduct.audience,
                category: existingProduct.category,
                tags: existingProduct.tags || [],
                price: existingProduct.price,
                discount: existingProduct.discount || 0,
                stock: existingProduct.stock || 0,
                thumbnail: null as unknown as File,
                images: [],
            });
            
            // Set image previews from existing URLs
            setThumbnailPreview(existingProduct.thumbnail);
            setImagesPreview(existingProduct.images);
        }
    }, [isEditMode, existingProduct, reset]);

    function addTag() {
        const v = tagValue.trim();
        if (!v) return;
        if (tags.includes(v)) {
            toast.info("Tag already added");
            return;
        }
        setValue("tags", [...tags, v]);
        setTagValue("");
    }

    function removeTag(tag: string) {
        setValue("tags", tags.filter((t) => t !== tag));
    }

    function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setValue("thumbnail", file, { shouldValidate: true });
            setThumbnailPreview(URL.createObjectURL(file));
        }
    }

    function removeThumbnail() {
        setValue("thumbnail", null as unknown as File);
        setThumbnailPreview(null);
    }

    function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (files.length) {
            setSelectedImages(files);
            setValue("images", files, { shouldValidate: true });
            setImagesPreview(files.map((f) => URL.createObjectURL(f)));
        }
    }

    function removeImage(index: number) {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);
        setValue("images", updatedImages, { shouldValidate: true });
        setImagesPreview(updatedImages.map((f) => URL.createObjectURL(f)));
    }


    // handle form submit 
    async function onSubmit(values: CreateProductFormValues) {
        try {
            if (isEditMode && slug) {
                // Update existing product
                const res = await updateMutate({ slug, data: values });
                navigate(`/products/${res.data.slug}`);
            } else {
                // Create new product
                const res = await createMutate(values);
                toast.success("Product created successfully");
                navigate(`/products/${res.data.slug}`);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} product`;
            toast.error(errorMessage);
        }
    }

    // Show loading state while fetching product data in edit mode
    if (isEditMode && isLoadingProduct) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-600">Loading product data...</p>
                </div>
            </div>
        );
    }

    const isPending = isCreating || isUpdating;

    return (
        <div className="max-w-5xl mx-auto w-full">
            <h1 className="text-xl font-semibold text-black mb-6">
                {isEditMode ? 'Edit Product' : 'Create Product'}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Basic Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name - Required field */}
                        <Input label="Name" {...register("name")} error={errors.name?.message} placeholder="Product name" />

                        {/* Seller/Store Name - Required field */}
                        <Input label="Sold By" {...register("soldBy")} error={errors.soldBy?.message} placeholder="Seller / Store" />

                        {/* Brand Name - Optional field */}
                        <Input label="Brand" {...register("brand")} error={errors.brand?.message} placeholder="Brand (optional)" />

                        {/* Target Audience - Required dropdown (men/women/children/all) */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1.5">Audience</label>
                            <select
                                className="w-full text-sm rounded-sm border border-neutral-300 px-3 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                {...register("audience")}
                            >
                                <option value="">Select audience</option>
                                {audienceEnum.options.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            {errors.audience && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.audience.message}</p>}
                        </div>

                        {/* Product Category - Required dropdown (clothing/electronics/etc) */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1.5">Category</label>
                            <select
                                className="w-full text-sm rounded-sm border border-neutral-300 px-3 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                {...register("category")}
                            >
                                <option value="">Select category</option>
                                {categoryEnum.options.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.category.message}</p>}
                        </div>

                        {/* Product Price - Required, positive number */}
                        <Input
                            label="Price"
                            type="number"
                            step="0.01"
                            {...register("price", { valueAsNumber: true })}
                            error={errors.price?.message}
                            placeholder="0.00"
                        />

                        {/* Discount Percentage - Optional, 0-100 */}
                        <Input
                            label="Discount (%)"
                            type="number"
                            {...register("discount", { valueAsNumber: true })}
                            error={errors.discount?.message}
                            placeholder="0"
                        />

                        {/* Stock Quantity - Optional, defaults to 0 */}
                        <Input
                            label="Stock"
                            type="number"
                            {...register("stock", { valueAsNumber: true })}
                            error={errors.stock?.message}
                            placeholder="0"
                        />
                    </div>

                    {/* Product Description - Required, max 800 chars */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1.5">Description *</label>
                        <textarea
                            rows={5}
                            className="w-full text-sm rounded-sm border border-neutral-300 px-3 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none"
                            placeholder="Describe the product..."
                            {...register("description")}
                        />
                        {errors.description && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.description.message}</p>}
                    </div>
                    {/* Tags Section - Required, min 1 tag, max 10 tags */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1.5">Tags (min 1, max 10) *</label>
                        {/* Tag Input Field - Type and press Enter or click Add button */}
                        <div className="flex gap-2 mb-3">
                            <input
                                value={tagValue}
                                onChange={(e) => setTagValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                                placeholder="Add a tag and press Enter"
                                className="flex-1 text-sm rounded-sm border border-neutral-300 px-3 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                            />
                            <Button type="button" onClick={addTag} variant="outline">Add</Button>
                        </div>
                        {/* Display Added Tags with Remove Button */}
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-sm bg-neutral-200 text-neutral-800">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="text-neutral-600 hover:text-black">×</button>
                                </span>
                            ))}
                            {tags.length === 0 && <p className="text-xs text-neutral-500">No tags added</p>}
                        </div>
                        {errors.tags && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.tags.message}</p>}
                    </div>
                </div>

                {/* Right: Media Section */}
                <div className="space-y-6">
                    {/* Thumbnail Image - Required, single file, <=5MB, jpeg/jpg/png/webp */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1.5">
                            Thumbnail {!isEditMode && '*'}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="w-full text-sm rounded-sm border border-neutral-300 px-3 py-2 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:rounded-sm file:bg-neutral-200 file:text-sm file:font-medium"
                        />
                        {!isEditMode && errors.thumbnail && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.thumbnail.message}</p>}
                        {isEditMode && <p className="mt-1.5 text-xs text-neutral-500">Leave empty to keep current thumbnail</p>}
                        {/* Thumbnail Preview - Shows selected image */}
                        {thumbnailPreview && (
                            <div className="mt-3 aspect-square w-full max-w-[200px] rounded-sm overflow-hidden border border-neutral-200 relative group">
                                <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={removeThumbnail}
                                    className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black rounded-full text-white transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Product Images - Required, min 1 max 4 files, <=5MB each, jpeg/jpg/png/webp */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1.5">
                            Images (min 1, max 4) {!isEditMode && '*'}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                            className="w-full text-sm rounded-sm border border-neutral-300 px-3 py-2 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:rounded-sm file:bg-neutral-200 file:text-sm file:font-medium"
                        />
                        {!isEditMode && errors.images && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.images.message}</p>}
                        {isEditMode && <p className="mt-1.5 text-xs text-neutral-500">Leave empty to keep current images</p>}
                        {/* Images Preview Grid - Shows selected images */}
                        {imagesPreview.length > 0 && (
                            <div className="mt-3 grid grid-cols-3 gap-3">
                                {imagesPreview.map((src, i) => (
                                    <div key={i} className="aspect-square rounded-sm overflow-hidden border border-neutral-200 relative group">
                                        <img src={src} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black rounded-full text-white transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button - Disabled while creating product */}
                    <Button type="submit" isLoading={isPending} className="w-full">
                        {isEditMode ? 'Update Product' : 'Create Product'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;
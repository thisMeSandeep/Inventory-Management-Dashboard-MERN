interface ProductSkeletonProps {
	count?: number;
}

const ProductSkeleton = ({ count = 12 }: ProductSkeletonProps) => {
	const items = Array.from({ length: count });
	return (
		<div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{items.map((_, idx) => (
				<div
					key={idx}
					className="rounded-sm border border-neutral-200 bg-white p-4 flex flex-col shadow-sm"
				>
					<div className="aspect-square w-full mb-3 rounded-sm bg-neutral-100 animate-pulse" />
					<div className="space-y-2">
						<div className="h-3 w-4/5 bg-neutral-200 rounded animate-pulse" />
						<div className="h-3 w-2/3 bg-neutral-200 rounded animate-pulse" />
						<div className="h-3 w-1/2 bg-neutral-200 rounded animate-pulse" />
					</div>
					<div className="mt-4 flex justify-between items-center">
						<div className="h-4 w-14 bg-neutral-200 rounded animate-pulse" />
						<div className="h-4 w-10 bg-neutral-200 rounded animate-pulse" />
					</div>
				</div>
			))}
		</div>
	);
};

export default ProductSkeleton;

import { Image as ImageIcon } from "lucide-react";

interface ProductListProps {
  // placeholder props for future data integration
  count?: number; // how many skeletons to show
}

const ProductList: React.FC<ProductListProps> = ({ count = 12 }) => {
  const items = Array.from({ length: count });

  return (
    <section>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((_, idx) => (
          <div
            key={idx}
            className="group relative rounded-sm border border-neutral-200 bg-white p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-square w-full mb-3 rounded-sm bg-neutral-100 flex items-center justify-center overflow-hidden">
              <ImageIcon className="h-8 w-8 text-neutral-400" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-4/5 bg-neutral-200 rounded" />
              <div className="h-3 w-2/3 bg-neutral-200 rounded" />
              <div className="h-3 w-1/2 bg-neutral-200 rounded" />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="h-4 w-14 bg-neutral-200 rounded" />
              <div className="h-4 w-10 bg-neutral-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;

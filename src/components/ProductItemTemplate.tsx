import { Product } from "@shelf-mate/api-client-ts";
import React from "react";

interface ProductItemTemplateProps {
  product: Product;
  onRemove: (id: string) => void;
  onEdit: (product: Product) => void;
}

const ProductItemTemplate: React.FC<ProductItemTemplateProps> = ({
  product,
  onRemove,
  onEdit,
}) => {
  return (
    <li className="flex justify-between items-center border-b py-4">
      <div>
        <h3 className="font-semibold">{product.name}</h3>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => onEdit(product)}
        >
          Edit
        </button>

        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => onRemove(product.id)}
        >
          Remove
        </button>
      </div>
    </li>
  );
};

export default ProductItemTemplate;

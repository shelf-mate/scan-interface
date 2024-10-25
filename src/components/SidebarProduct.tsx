import { Product } from "@shelf-mate/api-client-ts";
import React from "react";
import { useProduct } from "../providers/ProductProvider";
import { FaPen, FaTrash } from "react-icons/fa6";

interface ProductItemTemplateProps {
  product: Product;
}

const SidebarProduct: React.FC<ProductItemTemplateProps> = ({ product }) => {
  const { setCurEditProduct, deleteProduct } = useProduct();
  return (
    <li className="flex gap-1 justify-between items-center border-b py-4 px-2 max-w-full">
      <div className="flex-col overflow-hidden">
        <h3 className="font-semibold text-ellipsis overflow-hidden">
          {product.name}
        </h3>
        <p>
          <span className="text-sm text-gray-500">
            {product.storage.name} •&nbsp;
          </span>
          <span className="text-sm text-gray-500">{product.category.name}</span>
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="bg-warning  text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setCurEditProduct(product);
          }}
        >
          <FaPen />
        </button>

        <button
          className="bg-error text-white font-bold py-2 px-4 rounded"
          onClick={() => deleteProduct(product.id)}
        >
          <FaTrash />
        </button>
      </div>
    </li>
  );
};

export default SidebarProduct;

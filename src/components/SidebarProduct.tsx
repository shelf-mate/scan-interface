import { Product } from "@shelf-mate/api-client-ts";
import React from "react";
import { useProduct } from "../providers/ProductProvider";

interface ProductItemTemplateProps {
  product: Product;
}

const SidebarProduct: React.FC<ProductItemTemplateProps> = ({ product }) => {
  const { setCurEditProduct, deleteProduct } = useProduct();
  return (
    <li className="flex justify-between items-center border-b py-4">
      <div>
        <h3 className="font-semibold">{product.name}</h3>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => setCurEditProduct(product)}
        >
          Edit
        </button>

        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => deleteProduct(product.id)}
        >
          Remove
        </button>
      </div>
    </li>
  );
};

export default SidebarProduct;

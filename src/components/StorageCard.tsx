import React, { useEffect } from "react";
import { Storage } from "@shelf-mate/api-client-ts";
import {} from "react-icons/fa";
import { FaBoxesStacked, FaBoxesPacking } from "react-icons/fa6";
import { useStorage } from "../providers/StorageProvider";

interface StorageCardProps {
  selected: boolean;
  storage: Storage;
  onClick?: (storage: Storage) => void;
}
export default function StorageCard({
  storage,
  onClick,
  selected,
}: StorageCardProps): JSX.Element {
  const { getProducts } = useStorage();

  const [productsCount, setProductsCount] = React.useState<number>(0);
  useEffect(() => {
    getProducts(storage.id).then((products) => {
      setProductsCount(products.length);
    });
  }, [getProducts, storage.id]);

  return (
    <div className="indicator aspect-square  w-full max-w-[150px] text-slate-800">
      <span
        className={`indicator-item badge badge-primary -translate-x-1 ${
          selected
            ? "bg-blue-950 border-blue-950"
            : "bg-blue-700 border-blue-700"
        }`}
      >
        {productsCount}
      </span>
      <div
        key={storage.id}
        className={`${
          selected ? "!bg-gray-400" : "bg-gray-200"
        } aspect-square  w-full max-w-[150px] rounded-lg flex flex-col items-center cursor-pointer justify-center hover:bg-gray-300 overflow-hidden text-ellipsis`}
        onClick={() => {
          if (onClick) {
            onClick(storage);
          }
        }}
      >
        {selected ? (
          <FaBoxesPacking className="text-4xl flex" />
        ) : (
          <FaBoxesStacked className="text-4xl flex" />
        )}
        <h3 className="flex text-xl text-center text-ellipsis overflow-hidden">
          {storage.name}
        </h3>
      </div>
    </div>
  );
}

import React from "react";
import { Storage } from "@shelf-mate/api-client-ts";

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
  return (
    <div
      key={storage.id}
      className={`${
        selected ? "!bg-gray-400" : "bg-gray-200"
      } w-full px-6 py-20 rounded-lg flex flex-col items-center cursor-pointer hover:bg-gray-300`}
      onClick={() => {
        if (onClick) {
          onClick(storage);
        }
      }}
    >
      <h3 className="mt-4 text-xl">{storage.name}</h3>
    </div>
  );
}

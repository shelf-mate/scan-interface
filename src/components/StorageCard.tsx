import React, { useEffect, useState } from "react";
import { FaBoxesStacked, FaBoxesPacking } from "react-icons/fa6";
import { Storage } from "@shelf-mate/api-client-ts";
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
    const [productsCount, setProductsCount] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        getProducts(storage.id).then((products) => {
            setProductsCount(products.length);
        });
    }, [getProducts, storage.id]);

    const handleClick = () => {
        if (onClick) {
            setIsActive(true);
            setTimeout(() => setIsActive(false), 300);
            onClick(storage);
        }
    };

    return (
        <div
            className={`relative aspect-square w-full max-w-[160px] text-slate-800 transition-transform duration-300 ease-in-out ${
                isActive ? "scale-110" : "hover:scale-105"
            }`}
            onClick={handleClick}
        >
            <span
                className={`absolute top-2 right-2 badge ${
                    selected ? "bg-gray-800 text-white" : "bg-gray-600 text-white"
                } text-xs py-1 px-2 rounded-full`}
            >
                {productsCount}
            </span>
            <div
                key={storage.id}
                className={`${
                    selected ? "shadow-md border-2 border-gray-400" : "shadow-sm border"
                } aspect-square w-full max-w-[160px] bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 overflow-hidden transition-all duration-150 p-4`}
            >
                {selected ? (
                    <FaBoxesPacking className="text-5xl mb-2 text-gray-700" />
                ) : (
                    <FaBoxesStacked className="text-5xl mb-2 text-gray-600" />
                )}
                <h3 className="text-center text-lg font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                    {storage.name}
                </h3>
            </div>
        </div>
    );
}

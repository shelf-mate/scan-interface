import React, { useState } from "react";
import Modal from "../components/Modal";
import { useStorage } from "../providers/StorageProvider";
import SidebarProduct from "../components/SidebarProduct";
import { useProduct } from "../providers/ProductProvider";
import { Product } from "@shelf-mate/api-client-ts";
import StorageCard from "../components/StorageCard";
import { Toaster } from "react-hot-toast";
const _ = require("lodash");

const Home: React.FC = () => {
    const { selectedStorage, setSelectedStorage } = useStorage();

    const [inventory, setInventory] = useState<Product[]>([]);
    const [isModalOpen, setModalOpen] = useState<boolean>(true);
    const [newProduct, setNewProduct] = useState<Product | null>(null);

    const addProduct = (product: Product) => {
        setInventory([...inventory, product]);
        setNewProduct(product);
        setModalOpen(true);
    };

    const handleStorageSelect = (storageId: string) => {
        setSelectedStorage(storageId);
    };

    const { storages } = useStorage();
    const { products } = useProduct();

    return (
        <div className="flex flex-col bg-gray-50 text-gray-900 h-screen w-full">
            <div className="flex flex-1 overflow-hidden">
                {/* Storage Section */}
                <div className="w-1/2 p-4 flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 text-left">
                        Storages
                    </h2>
                    <div className="grid grid-cols-3 gap-4 overflow-visible">
                        {storages.map((storage) => (
                            <StorageCard
                                key={storage.id}
                                onClick={(s) => handleStorageSelect(s.id)}
                                selected={storage.id === selectedStorage}
                                storage={storage}
                            />
                        ))}
                    </div>
                </div>
                <div className="w-1/2 bg-gray-100 p-4 rounded-lg shadow flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 text-left">
                        Recently Added
                    </h2>
                    <ul className="space-y-2 overflow-y-auto flex-1">
                        {_.orderBy(products, "updatedAt", "desc").map((product: Product) => (
                            <SidebarProduct key={product.id} product={product} />
                        ))}
                    </ul>
                </div>
            </div>
            <Modal />
            <Toaster position="top-center" />
        </div>
    );
};

export default Home;

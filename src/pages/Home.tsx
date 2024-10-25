import React, { useState } from "react";
import Modal from "../components/Modal";
import { useStorage } from "../providers/StorageProvider";
import SidebarProduct from "../components/SidebarProduct";
import { useProduct } from "../providers/ProductProvider";
import { Product } from "@shelf-mate/api-client-ts";
import StorageCard from "../components/StorageCard";
import { Toaster } from "react-hot-toast";
const _ = require("lodash");

interface Storage {
  id: number;
  name: string;
  icon: JSX.Element;
}
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
    <div className="flex justify-between  bg-white text-black h-screen">
      <div className="w-3/5 p-4 flex flex-col">
        <h1 className="text-5xl font-bold pb-8">Storage</h1>
        <div className="grid flex-1 grid-cols-3 p-3 gap-6 justify-items-start overflow-y-auto">
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
      <div className="w-2/5 p-4 flex flex-col bg-gray-100">
        <h2 className="text-3xl font-bold mb-4 p-4 text-center">
          Recently Added
        </h2>
        <ul className="space-y-4 overflow-y-auto flex-1 w-full">
          {_.orderBy(products, "updatedAt", "desc").map((product: Product) => (
            <SidebarProduct key={product.id} product={product} />
          ))}
        </ul>
      </div>
      <Modal />
      <Toaster position="top-right" />
    </div>
  );
};

export default Home;

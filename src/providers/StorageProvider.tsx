import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import {
  getProductsByStorage,
  getStorages,
  Product,
  Response,
  Storage,
} from "@shelf-mate/api-client-ts";
import { useProduct } from "./ProductProvider";
interface StorageContextProps {
  storages: Storage[];
  selectedStorage: string | undefined;
  setSelectedStorage: (storageId: string) => void;
  getProducts: (storageId: string) => Promise<Product[]>;
}

const StorageContext = createContext<StorageContextProps | undefined>(
  undefined
);

export const StorageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [storages, setStorages] = useState<Storage[]>([]);
  const { products } = useProduct();
  const [storageProducts, setStorageProducts] = useState<{
    [key: string]: Product[];
  }>({});
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>();
  useEffect(() => {
    getStorages().then((res) => {
      // @ts-ignore
      setStorages(res.data);
    });
  }, []);

  const getProducts = async (storageId: string) => {
    return products.filter((prod) => prod.storage.id === storageId);
  };

  return (
    <StorageContext.Provider
      value={{ storages, selectedStorage, setSelectedStorage, getProducts }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = (): StorageContextProps => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
};

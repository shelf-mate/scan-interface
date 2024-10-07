import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { getStorages, Response, Storage } from "@shelf-mate/api-client-ts";
interface StorageContextProps {
  storages: Storage[];
}

const StorageContext = createContext<StorageContextProps | undefined>(
  undefined
);

export const StorageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [storages, setStorages] = useState<Storage[]>([]);

  useEffect(() => {
    getStorages().then((res) => {
      // @ts-ignore
      setStorages(res.data);
    });
  }, []);

  return (
    <StorageContext.Provider value={{ storages }}>
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
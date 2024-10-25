import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  getProductTemplateByEan,
  ProductTemplate,
  updateProductTemplate,
  deleteProductTemplate,
  ProductTemplateCreateData,
  Response,
  Product,
} from "@shelf-mate/api-client-ts";
import { useStorage } from "./StorageProvider";
import toast from "react-hot-toast";
import { useProduct } from "./ProductProvider";
import { AxiosResponse } from "axios";
import moment from "moment";

interface ProductTemplateContextProps {
  currentProductTemplate: ProductTemplate | undefined;
  isNew: boolean;
  save: (data: ProductTemplateCreateData) => void;
  delete: () => void;
}

const ProductTemplateContext = createContext<
  ProductTemplateContextProps | undefined
>(undefined);

export const ProductTemplateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { selectedStorage, setSelectedStorage } = useStorage();
  const { createProduct: addProduct, setCurEditProduct } = useProduct();

  const [productTemplate, setProductTemplate] = useState<
    ProductTemplate | undefined
  >({
    id: "c1ed6edc-dc9b-4b49-8681-c412bb82f58b",
    name: "Product",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [isNew, setIsNew] = useState<boolean>(true);
  const socket = useRef<WebSocket>();
  const handleWebsocketMessage = useCallback(
    (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.command === "scan") {
        if (!selectedStorage) {
          toast.error("Please select a storage before scanning a product!");
          return;
        }
        getProductTemplateByEan(data.data.ean)
          .then((res) => {
            // @ts-ignore
            setIsNew(res.new);
            // @ts-ignore
            setProductTemplate(res.data);
            //setSelectedStorage("28592c7d-b55b-48ea-8deb-912c5c861135");

            //@ts-ignore
            console.log(res.new);
            //@ts-ignore
            if (res.new) {
              socket.current?.send(
                JSON.stringify({ command: "block", data: true })
              );
            } else {
              addProduct({
                //@ts-ignore
                name: res.data.name,
                //@ts-ignore
                categoryId: res.data.category.id,

                expirationDate:
                  //@ts-ignore
                  res.data.expirationTime !== undefined
                    ? moment()
                        //@ts-ignore
                        .add(res.data.expirationTime + 1, "days")
                        .toDate()
                    : new Date(),
                storageId: selectedStorage,
                quantity: 1,
                //@ts-ignore
                unitId: res.data.unit.id,
              }).then((prod: Product) => {
                setCurEditProduct(prod);
              });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    [selectedStorage, socket]
  );

  useEffect(() => {
    console.log("add event listner");
    console.log(socket.current?.readyState);
    socket.current?.addEventListener("message", () => console.log("message"));
    return () => {
      socket.current?.removeEventListener("message", handleWebsocketMessage);
    };
  }, [handleWebsocketMessage, socket]);
  useEffect(() => {
    console.log("create socket");
    if (!socket.current) {
      socket.current = new WebSocket(
        process.env.REACT_APP_SCAN_SERVER_URL ?? "http://localhost:8000"
      );
    }
    socket.current.addEventListener("message", handleWebsocketMessage);

    return () => {
      socket.current?.removeEventListener("message", handleWebsocketMessage);
    };
  }, [handleWebsocketMessage]);

  const del = async () => {
    if (!productTemplate) return;
    try {
      await deleteProductTemplate(productTemplate.id).then(() => {
        setProductTemplate(undefined);
        console.log(socket);
        socket.current?.send(JSON.stringify({ command: "block", data: false }));
      });
    } catch (err) {
      console.error(err);
    }
  };

  const save = async (data: ProductTemplateCreateData) => {
    if (!productTemplate) return;
    try {
      updateProductTemplate(productTemplate.id, data).then((res) => {
        // @ts-ignore
        setProductTemplate(undefined);
        socket.current?.send(JSON.stringify({ command: "block", data: false }));
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ProductTemplateContext.Provider
      value={{
        currentProductTemplate: productTemplate,
        isNew,
        delete: del,
        save,
      }}
    >
      {children}
    </ProductTemplateContext.Provider>
  );
};

export const useProductTemplate = (): ProductTemplateContextProps => {
  const context = useContext(ProductTemplateContext);
  if (!context) {
    throw new Error(
      "useProductTemplate must be used within a ProductTemplateProvider"
    );
  }
  return context;
};

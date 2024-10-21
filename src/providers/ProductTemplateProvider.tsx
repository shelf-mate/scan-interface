import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import {
  getProductTemplateByEan,
  ProductTemplate,
  createProductTemplate,
  WithoutDates,
  updateProductTemplate,
  deleteProductTemplate,
  ProductTemplateCreateData,
} from "@shelf-mate/api-client-ts";
import axios from "axios";

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
  const [productTemplate, setProductTemplate] = useState<
    ProductTemplate | undefined
  >();

  const [isNew, setIsNew] = useState<boolean>(true);
  const socket = useRef<WebSocket>();
  useEffect(() => {
    socket.current = new WebSocket(
      process.env.REACT_APP_SCAN_SERVER_URL ?? "http://localhost:8000"
    );

    // Connection opened
    socket.current.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.command === "scan") {
        getProductTemplateByEan(data.data.ean)
          .then((res) => {
            // @ts-ignore
            setIsNew(res.new);
            // @ts-ignore
            setProductTemplate(res.data);

            //@ts-ignore
            console.log(res.new);
            //@ts-ignore
            if (res.new) {
              socket.current?.send(
                JSON.stringify({ command: "block", data: true })
              );
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
    return () => {
      socket.current?.close();
    };
  }, []);

  const del = async () => {
    if (!productTemplate) return;
    try {
      await deleteProductTemplate(productTemplate.id).then(() => {
        setProductTemplate(undefined);
        console.log(socket.current);
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

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  getProductTemplateByEan,
  ProductTemplate,
} from "@shelf-mate/api-client-ts";
import axios from "axios";

interface ProductTemplateContextProps {
  currentProductTemplate: ProductTemplate | undefined;
  isNew: boolean;
}

const ProductTemplateContext = createContext<
  ProductTemplateContextProps | undefined
>(undefined);

export const ProductTemplateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [productTemplate, setProductTemplate] = useState<
    ProductTemplate | undefined
  >(undefined);

  const [isNew, setIsNew] = useState<boolean>(false);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000");

    // Connection opened
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.command === "scan") {
        console.log(data);

        getProductTemplateByEan(data.data.ean)
          .then((res) => {
            console.log(res);
            // @ts-ignore
            setIsNew(res.new);
            // @ts-ignore

            setProductTemplate(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
    return () => {
      socket.close();
    };
  }, []);

  return (
    <ProductTemplateContext.Provider
      value={{ currentProductTemplate: productTemplate, isNew }}
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

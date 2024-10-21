import {
  createProduct,
  getProducts,
  Product,
  ProductCreateData,
} from "@shelf-mate/api-client-ts";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface ProductContextType {
  products: Product[];
  addProduct: (product: ProductCreateData) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (product: ProductCreateData) => {
    createProduct(product).then((res) => {
      //@ts-ignore
      setProducts([...products, res.data]);
    });
  };

  useEffect(() => {
    getProducts().then((res) => {
      //@ts-ignore
      setProducts(res.data);
    });
  }, []);

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

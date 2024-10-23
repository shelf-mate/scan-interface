import {
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
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
  createProduct: (product: ProductCreateData) => Promise<Product>;
  updateProduct: (id: string, product: Partial<ProductCreateData>) => void;
  curEditProduct: Product | undefined;
  setCurEditProduct: (product: Product | undefined) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [curEditProduct, setCurEditProduct] = useState<Product | undefined>();

  const createProduct = async (product: ProductCreateData) => {
    const res = await apiCreateProduct(product);
    //@ts-ignore
    setProducts([...products, res.data]);
    //@ts-ignore
    return res.data;
  };

  useEffect(() => {
    getProducts().then((res) => {
      //@ts-ignore
      setProducts(res.data);
    });
  }, []);

  const updateProduct = (id: string, product: Partial<ProductCreateData>) => {
    apiUpdateProduct(id, product).then((res) => {
      setProducts(
        //@ts-ignore
        products.map((prod) => (prod.id === id ? res.data : prod))
      );
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        createProduct: createProduct,
        curEditProduct,
        updateProduct,
        setCurEditProduct: (prod) => setCurEditProduct(prod),
      }}
    >
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

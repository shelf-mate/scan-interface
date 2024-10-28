import {
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  getProducts,
  Product,
  ProductCreateData,
  deleteProduct,
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
  deleteProduct: (id: string) => void;
  curEditProduct: Product | undefined;
  setCurEditProduct: (product: Product | undefined) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [curEditProduct, setCurEditProduct] = useState<Product | undefined>(
    undefined
  );

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

  const deleteProduct = (id: string) => {
    apiDeleteProduct(id).then(() => {
      setProducts(
        //@ts-ignore
        products.filter((prod) => prod.id !== id)
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
        deleteProduct,
        setCurEditProduct,
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

import { Category, getCategories } from "@shelf-mate/api-client-ts";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useProductTemplate } from "./ProductTemplateProvider";

interface CategoryContextProps {
  categories: Category[];
}

const CategoryContext = createContext<CategoryContextProps | undefined>(
  undefined
);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { currentProductTemplate, isNew } = useProductTemplate();

  useEffect(() => {
    getCategories().then((res) => {
      //@ts-ignore
      setCategories(res.data);
    });
  }, [currentProductTemplate, isNew]);

  return (
    <CategoryContext.Provider value={{ categories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = (): CategoryContextProps => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};

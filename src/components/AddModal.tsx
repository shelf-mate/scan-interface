import React, { useEffect, useRef, useState } from "react";
import ModalInputs from "./ModalInputs";
import { useProductTemplate } from "../providers/ProductTemplateProvider";
import { Product } from "@shelf-mate/api-client-ts";
import { useProduct } from "../providers/ProductProvider";
import toast, { Toaster } from "react-hot-toast";

interface AddModalProps {}

export type ProductEditData = Partial<
  Omit<Product, "id" | "createdAt" | "updatedAt">
> & {
  categoryId?: string;
  storageId?: string;
  unitId?: string;
};

export default function AddModal({}: AddModalProps) {
  const { currentProductTemplate, isNew } = useProductTemplate();
  const { addProduct } = useProduct();
  const [productData, setProductData] = useState<ProductEditData>({});

  const modalRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    console.log("currentProductTemplate add modal", isNew);
    console.log("currentProductTemplate add modal", currentProductTemplate);
    if (currentProductTemplate && isNew) {
      modalRef.current?.showModal();
      setProductData({
        name: currentProductTemplate?.name ?? "",
        categoryId: currentProductTemplate?.category?.id,
      });
    } else {
      modalRef.current?.close();
    }
  }, [currentProductTemplate, isNew]);

  const onClose = () => {};

  return (
    <dialog id="add_modal" className="modal" ref={modalRef}>
      <Toaster position="top-right" />
      <div className=" modal-box  max-w-none w-fit bg-gray-200  flex justify-center items-center flex-col">
        <div className="flex">
          <h2 className="font-bold text-lg">
            Please confirm the data for the added product!
          </h2>
        </div>

        <ModalInputs productEditData={productData} onChange={setProductData} />
        <div className="flex justify-end">
          <button
            className="btn btn-primary flex"
            onClick={() => {
              let valid = true;
              if (!productData.name || productData.name === "") {
                valid = false;
                toast.error("Please enter a name for the product");
              }
              if (valid) {
                addProduct(productData as Product);
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </dialog>
  );
}

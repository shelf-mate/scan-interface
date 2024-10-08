import React, { useEffect, useRef, useState } from "react";
import ModalInputs from "./ModalInputs";
import { useProductTemplate } from "../providers/ProductTemplateProvider";
import { Product } from "@shelf-mate/api-client-ts";
import { useProduct } from "../providers/ProductProvider";
import toast, { Toaster } from "react-hot-toast";
import moment from "moment";

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
    if (currentProductTemplate && isNew) {
      modalRef.current?.showModal();
      setProductData({
        name: currentProductTemplate?.name ?? "",
        categoryId: currentProductTemplate?.category?.id,
        expirationDate: currentProductTemplate?.expirationTime
          ? moment()
              .add(currentProductTemplate.expirationTime, "days")
              .toISOString()
          : undefined,
      });
    } else {
      modalRef.current?.close();
    }
  }, [currentProductTemplate, isNew]);

  const onClose = () => {};

  return (
    <dialog id="add_modal" className="modal" ref={modalRef}>
      <Toaster position="top-right" />
      <div className=" modal-box p-4 max-h-[calc(100vh-1em)] max-w-[calc(100vw-1em)] h-full  bg-gray-200 flex justify-center items-center flex-col">
        <div className="">
          <h2 className="font-bold text-sm">
            Please confirm the data for the added product!
          </h2>
        </div>
        <div className="flex-1 w-full h-[80%]">
          <ModalInputs
            productEditData={productData}
            onChange={setProductData}
          />
        </div>
        <div className="h-[10%]">
          <button
            className="btn btn-md btn-success flex"
            onClick={() => {
              let valid = true;
              if (!productData.name || productData.name === "") {
                valid = false;
                toast.error("Please enter a name for the product");
              }
              if (!productData.categoryId) {
                valid = false;
                toast.error("Please select a category for the product");
              }
              if (!productData.expirationDate) {
                valid = false;
                toast.error("Please select an expiration date for the product");
              }
              if (!productData.unitId) {
                valid = false;
                toast.error("Please select a unit for the product");
              }
              if (!productData.quantity) {
                valid = false;
                toast.error("Please select a quantity for the product");
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

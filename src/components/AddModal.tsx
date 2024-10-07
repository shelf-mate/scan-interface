import React, { useEffect, useRef, useState } from "react";
import ModalInputs from "./ModalInputs";
import { useProductTemplate } from "../providers/ProductTemplateProvider";
import { Product } from "@shelf-mate/api-client-ts";

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
  const [productData, setProductData] = useState<ProductEditData>({});

  const modalRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    console.log("currentProductTemplate add modal", isNew);
    console.log("currentProductTemplate add modal", currentProductTemplate);
    if (currentProductTemplate && isNew) {
      modalRef.current?.showModal();
      setProductData({
        name: currentProductTemplate?.name,
        categoryId: { id: currentProductTemplate?.category?.id },
      });
    } else {
      modalRef.current?.close();
    }
  }, [currentProductTemplate, isNew]);

  const onClose = () => {};

  return (
    <dialog id="add_modal" className="modal" ref={modalRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Please confirm the data for the added product!
        </h3>
        <ModalInputs productEditData={productData} onChange={setProductData} />
      </div>
    </dialog>
  );
}

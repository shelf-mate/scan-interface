import React, { useEffect, useRef, useState } from "react";
import ModalInputs from "./ModalInputs";
import { useProductTemplate } from "../providers/ProductTemplateProvider";
import {
  createProduct,
  Product,
  ProductCreateData,
  updateProduct,
} from "@shelf-mate/api-client-ts";
import { useProduct } from "../providers/ProductProvider";
import toast, { Toaster } from "react-hot-toast";
import moment from "moment";
import { useStorage } from "../providers/StorageProvider";

interface EditModalProps {}

// The editData needs to be a complete and not partial as every field should be already there
export type ProductEditData = ProductCreateData;

const prodToProdCreateData = (prod: Product): ProductCreateData => {
  return {
    name: prod.name,
    categoryId: prod.category.id,
    expirationDate: prod.expirationDate,
    storageId: prod.storage.id,
    quantity: prod.quantity,
    unitId: prod.unit.id,
  };
};
export default function EditModal({}: EditModalProps) {
  const {
    updateProduct: saveProduct,
    curEditProduct,
    setCurEditProduct,
  } = useProduct();
  const [productData, setProductData] = useState<Partial<ProductEditData>>(
    curEditProduct ?? {}
  );

  const modalRef = useRef<HTMLDialogElement>(null);
  const confirmRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (curEditProduct) {
      setProductData(prodToProdCreateData(curEditProduct));
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [curEditProduct]);

  const handleClose = () => {
    setCurEditProduct(undefined);
    modalRef.current?.close();
  };

  // TODO: get error messages from Provider / BACKEND
  // QUESTION: Should we also update the productTemplate when the users edits a product
  const handleSave = async () => {
    try {
      if (!curEditProduct) {
        throw new Error("No product to edit");
      }
      await saveProduct(curEditProduct.id, productData as ProductCreateData);
      modalRef.current?.close();
    } catch (err) {}
  };

  return (
    <dialog
      id="edit_modal"
      className="modal"
      ref={modalRef}
      onCancel={(e) => {
        confirmRef.current?.showModal();
        e.preventDefault();
      }}
    >
      <Toaster position="top-right" />
      <div className=" modal-box p-4 max-h-[calc(100vh-1em)] max-w-[calc(100vw-1em)] h-full  bg-gray-200 flex justify-center items-center flex-col">
        <div className="text-center">
          <h2 className="font-bold text-md">Edit Product Data</h2>
          <p className="text-gray-700">
            Edit the product data if it is incorrect.
          </p>
        </div>
        <div className="flex-1 w-full h-[80%]">
          <ModalInputs
            productEditData={productData}
            onChange={setProductData}
          />
        </div>
        <div className="h-[10%] flex">
          <button className="btn btn-md flex mr-2" onClick={handleClose}>
            Close
          </button>
          <button className="btn btn-md btn-success flex" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </dialog>
  );
}

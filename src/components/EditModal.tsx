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

  const handleSave = async () => {
    try {
      if (!curEditProduct) {
        throw new Error("Kein Produkt zum Bearbeiten vorhanden");
      }
      console.log("Speichere Daten:", productData);
      await saveProduct(curEditProduct.id, productData as ProductCreateData);
      toast.success("Product saved!");
      modalRef.current?.close();
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      toast.error("Speichern fehlgeschlagen. Bitte versuche es erneut.");
    }
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
        <Toaster position="top-center" />
        <div className="modal-box p-6 max-h-[calc(100vh-2em)] max-w-[calc(100vw-2em)] h-full bg-gray-100 rounded-xl shadow-lg flex justify-center items-center flex-col overflow-hidden">
          <div className="text-center">
            <h2 className="font-bold text-lg text-gray-800">Edit Product Data</h2>
            <p className="text-gray-600 text-sm">
              Make changes to the product details if necessary.
            </p>
          </div>
          <div className="flex-1 w-full mt-4">
            <ModalInputs
                productEditData={productData}
                onChange={setProductData}
                onSave={handleSave}
                onCancel={handleClose}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
                className="px-40 py-4 text-sm font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                onClick={handleClose}
            >
              Close
            </button>
            <button
                className="px-40 py-4 text-sm font-medium bg-primaryColor text-white rounded-lg hover:bg-blue-600 transition"
                onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
  );
}

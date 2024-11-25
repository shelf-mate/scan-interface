import React, { useEffect, useRef, useState } from "react";
import ModalInputs from "./ModalInputs";
import { useProduct } from "../providers/ProductProvider";
import toast, { Toaster } from "react-hot-toast";
import {Product, ProductCreateData } from "@shelf-mate/api-client-ts";

interface EditModalProps {}

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

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (curEditProduct) {
      setProductData(prodToProdCreateData(curEditProduct));
      if (modalRef.current) modalRef.current.classList.add("modal-open");
    } else {
      if (modalRef.current) modalRef.current.classList.remove("modal-open");
    }
  }, [curEditProduct]);

  const handleClose = () => {
    setCurEditProduct(undefined);
    if (modalRef.current) modalRef.current.classList.remove("modal-open");
  };

  const handleSave = async () => {
    try {
      if (!curEditProduct) {
        throw new Error("Kein Produkt zum Bearbeiten vorhanden");
      }
      await saveProduct(curEditProduct.id, productData as ProductCreateData);
      toast.success("Product saved!");
      if (modalRef.current) modalRef.current.classList.remove("modal-open");
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      toast.error("Speichern fehlgeschlagen. Bitte versuche es erneut.");
    }
  };

  return (
      <>
        <Toaster position="top-center"/>
        <div ref={modalRef} className="modal">
          <div className="modal-box bg-gray-100 rounded-xl shadow-lg max-w-[760px] w-full max-h-[440px] p-6 overflow-hidden">
            <div className="text-center">
              <h2 className="font-bold text-lg text-gray-800">Edit Product Data</h2>
            </div>
            <div className="mt-6">
              <ModalInputs
                  productEditData={productData}
                  onChange={setProductData}
                  onSave={handleSave}
                  onCancel={handleClose}
              />
              <div className="modal-action p-1 flex justify-between">
                <button
                    className="max-w-[342px] w-full py-4 text-sm font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    onClick={handleClose}
                >
                  Close
                </button>
                <button
                    className="max-w-[342px] w-full py-4 text-sm font-medium bg-primaryColor text-white rounded-lg hover:bg-blue-600 transition"
                    onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

      </>
  );
}
import React, { useEffect, useRef, useState } from "react";
import ModalInputs from "./ModalInputs";
import { useProductTemplate } from "../providers/ProductTemplateProvider";
import { ProductCreateData } from "@shelf-mate/api-client-ts";
import { useProduct } from "../providers/ProductProvider";
import toast, { Toaster } from "react-hot-toast";
import moment from "moment";
import { useStorage } from "../providers/StorageProvider";

interface AddModalProps {}

export type ProductEditData = Partial<ProductCreateData>;

export default function AddModal({}: AddModalProps) {
  const {
    currentProductTemplate,
    isNew,
    save: saveProductTemplate,
    delete: deleteProductTemplate,
  } = useProductTemplate();
  const { selectedStorage } = useStorage();
  const { createProduct: saveProduct } = useProduct();
  const [productData, setProductData] = useState<ProductEditData>({});

  const modalRef = useRef<HTMLDialogElement>(null);
  const confirmRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (currentProductTemplate && isNew) {
      modalRef.current?.showModal();
      setProductData({
        name: currentProductTemplate?.name ?? "",
        categoryId: currentProductTemplate?.category?.id,
        expirationDate: currentProductTemplate?.expirationTime
            ? moment().add(currentProductTemplate.expirationTime, "days").toDate()
            : new Date(),
        storageId: selectedStorage,
      });
    } else {
      modalRef.current?.close();
    }
  }, [currentProductTemplate, isNew, selectedStorage]);

  const handleDelete = () => {
    deleteProductTemplate();
    confirmRef.current?.close();
    modalRef.current?.close();
  };

  const handleSave = async () => {
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
    if (!productData.storageId) {
      valid = false;
      toast.error("Please select a storage for the product");
    }

    if (valid) {
      try {
        await saveProductTemplate({
          categoryId: productData.categoryId as string,
          expirationTime: moment(productData.expirationDate).diff(
              moment(),
              "days"
          ),
          name: productData.name as string,
          unitId: productData.unitId as string,
        });
        await saveProduct(productData as ProductCreateData);
        toast.success("Product successfully saved!");
        modalRef.current?.close();
      } catch (err) {
        console.error("Error saving product:", err);
        toast.error("Failed to save the product. Please try again.");
      }
    }
  };

  return (
      <dialog
          id="add_modal"
          className="modal"
          ref={modalRef}
          onCancel={(e) => {
            confirmRef.current?.showModal();
            e.preventDefault();
          }}
      >
        <dialog
            className="modal"
            ref={confirmRef}
            onCancel={(e) => {
              handleDelete();
              e.preventDefault();
            }}
        >
          <div className="modal-box rounded-xl shadow-lg p-6 bg-white">
            <h3 className="font-bold text-lg text-gray-800">Confirmation</h3>
            <p className="py-4 text-gray-600">
              The product won't be saved! Are you sure you want to exit?
            </p>
            <div className="flex justify-end gap-3">
              <button
                  className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  onClick={() => confirmRef.current?.close()}
              >
                Back
              </button>
              <button
                  className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </dialog>
        <Toaster position="top-center" />
        <div className="modal-box p-6 max-h-[calc(100vh-2em)] max-w-[calc(100vw-2em)] h-full bg-white rounded-xl shadow-lg flex justify-center items-center flex-col overflow-hidden">
          <div className="text-center">
            <h2 className="font-bold text-lg text-gray-800">New Product</h2>
            <p className="text-gray-600 text-sm">
              Fill in the details to add a new product.
            </p>
          </div>
          <div className="flex-1 w-full mt-4">
            <ModalInputs
                productEditData={productData}
                onChange={setProductData}
                onSave={handleSave}
                onCancel={() => confirmRef.current?.showModal()}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
                className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                onClick={() => confirmRef.current?.showModal()}
            >
              Close
            </button>
            <button
                className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
  );
}

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
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentProductTemplate && isNew) {
      setProductData({
        name: currentProductTemplate?.name ?? "",
        categoryId: currentProductTemplate?.category?.id,
        expirationDate: currentProductTemplate?.expirationTime
            ? moment().add(currentProductTemplate.expirationTime, "days").toDate()
            : new Date(),
        storageId: selectedStorage,
      });
      if (modalRef.current) modalRef.current.classList.add("modal-open");
    } else {
      if (modalRef.current) modalRef.current.classList.remove("modal-open");
    }
  }, [currentProductTemplate, isNew, selectedStorage]);

  const handleDelete = () => {
    deleteProductTemplate();
    if (confirmRef.current) confirmRef.current.classList.remove("modal-open");
    if (modalRef.current) modalRef.current.classList.remove("modal-open");
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
        if (modalRef.current) modalRef.current.classList.remove("modal-open");
      } catch (err) {
        console.error("Error saving product:", err);
        toast.error("Failed to save the product. Please try again.");
      }
    }
  };

  return (
      <>
        <Toaster position="top-center" />
        <div ref={modalRef} className="modal">
          <div className="modal-box bg-gray-100 rounded-xl shadow-lg max-w-[760px] w-full max-h-[440px] p-6 overflow-hidden">
            <div className="text-center">
              <h2 className="font-bold text-lg text-gray-800">New Product</h2>
              <p className="text-gray-600 text-sm">
                Fill in the details to add a new product.
              </p>
            </div>
            <div className="mt-6">
              <ModalInputs
                  productEditData={productData}
                  onChange={setProductData}
                  onSave={handleSave}
                  onCancel={() =>
                      confirmRef.current?.classList.add("modal-open")
                  }
              />
              <div className="modal-action p-1 flex justify-between">
                <button
                    className="max-w-[342px] w-full py-4 text-sm font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    onClick={() =>
                        confirmRef.current?.classList.add("modal-open")
                    }
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
        <div ref={confirmRef} className="modal">
          <div className="modal-box rounded-xl shadow-lg p-6 bg-white">
            <h3 className="font-bold text-lg text-gray-800">Confirmation</h3>
            <p className="py-4 text-gray-600">
              The product won't be saved! Are you sure you want to exit?
            </p>
            <div className="flex justify-end gap-3">
              <button
                  className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  onClick={() =>
                      confirmRef.current?.classList.remove("modal-open")
                  }
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
        </div>
      </>
  );
}
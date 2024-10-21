import React, { useEffect, useRef, useState } from "react";
import ModalInputs from "./ModalInputs";
import { useProductTemplate } from "../providers/ProductTemplateProvider";
import { Product, ProductCreateData } from "@shelf-mate/api-client-ts";
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
  const { addProduct: saveProduct } = useProduct();
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

  // TODO: get error messages from Provider / BACKEND
  const handleSave = async () => {
    let valid = true;
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
        modalRef.current?.close();
      } catch (err) {}
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
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            The product won't be saved! Are you sure you want to exit?
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn mr-2">Back</button>
              <button onClick={handleDelete} className="btn btn-error">
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <Toaster position="top-right" />
      <div className=" modal-box p-4 max-h-[calc(100vh-1em)] max-w-[calc(100vw-1em)] h-full  bg-gray-200 flex justify-center items-center flex-col">
        <div className="text-center">
          <h2 className="font-bold text-md">New Product!</h2>
          <p className="text-gray-700">
            You can't scan a new product until you confirmed the data!
          </p>
        </div>
        <div className="flex-1 w-full h-[80%]">
          <ModalInputs
            productEditData={productData}
            onChange={setProductData}
          />
        </div>
        <div className="h-[10%] flex">
          <button
            className="btn btn-md btn-error flex mr-2"
            onClick={() => confirmRef.current?.showModal()}
          >
            Abort
          </button>
          <button className="btn btn-md btn-success flex" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </dialog>
  );
}

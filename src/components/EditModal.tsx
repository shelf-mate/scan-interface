import React, { useEffect, useRef } from "react";
import ModalInputs from "./ModalInputs";
import { useProductTemplate } from "../providers/ProductTemplateProvider";

interface EditModalProps {}

export default function EditModal({}: EditModalProps) {
  const { currentProductTemplate, isNew } = useProductTemplate();
  const modalRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    console.log("currentProductTemplate edit modal", isNew);
    console.log("currentProductTemplate edit modal", currentProductTemplate);

    if (currentProductTemplate && !isNew) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [currentProductTemplate, isNew]);
  return (
    <dialog id="edit_modal" className="modal" ref={modalRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Successfully added new Product! You may edit it{" "}
          {currentProductTemplate?.name} here!
        </h3>
        <ModalInputs />
      </div>
    </dialog>
  );
}

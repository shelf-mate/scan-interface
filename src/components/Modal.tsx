import { ProductTemplate } from "@shelf-mate/api-client-ts";
import React, { ReactNode, useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useProductTemplate } from "../providers/ProductTemplateProvider";
import AddModal from "./AddModal";
import EditModal from "./EditModal";

export const Modal: React.FC = () => {
  return (
    <>
      <AddModal />
      <EditModal />
    </>
  );
};

export default Modal;

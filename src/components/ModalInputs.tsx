import React from "react";
import { ProductEditData } from "./AddModal";
import { useCategory } from "../providers/CategoryProvider";
import { DatePicker } from "@mantine/dates";
import { useProductTemplate } from "../providers/ProductTemplateProvider";
export interface AddModalProps {
  productData: ProductEditData;
  onChange: (data: ProductEditData) => void;
}

export default function ModalInputs({ productData, onChange }: AddModalProps) {
  const { categories } = useCategory();
  const { currentProductTemplate } = useProductTemplate();

  return (
    <form className="max-w-sm mx-auto">
      <div className="mb-5">
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Name
        </label>
        <input
          type="name"
          id="name"
          onChange={(e) => onChange({ ...productData, name: e.target.value })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Name"
          required
        />
      </div>

      <div className="mb-5">
        <select
          className="select select-lg w-full max-w-xs"
          onChange={(e) => console.log(e)}
        >
          <option
            disabled
            selected={currentProductTemplate?.category == undefined}
          >
            What category is the product in?
          </option>
          {categories.map((category) => (
            <option
              key={category.id}
              selected={currentProductTemplate?.category?.id == category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <DatePicker value={} onChange={(e) => console.log(e)} />
      </div>

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  );
}

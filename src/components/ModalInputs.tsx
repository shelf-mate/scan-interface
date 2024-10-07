import React from "react";
import { ProductEditData } from "./AddModal";
import { useCategory } from "../providers/CategoryProvider";
import { DatePicker } from "@mantine/dates";
import { useProductTemplate } from "../providers/ProductTemplateProvider";
import moment from "moment";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useUnit } from "../providers/UnitProvider";
export interface AddModalProps {
  productEditData: ProductEditData;
  onChange: (data: ProductEditData) => void;
}

export default function ModalInputs({
  productEditData,
  onChange,
}: AddModalProps) {
  const { categories } = useCategory();
  const { units } = useUnit();
  return (
    <form className="w-full mt-5">
      <h1 className="mt-4 mb-1 text-xl bold text-slate-600">Name</h1>
      <input
        type="name"
        id="name"
        onChange={(e) => onChange({ ...productEditData, name: e.target.value })}
        value={productEditData.name}
        className={`input input-lg ${
          productEditData.name && productEditData.name !== ""
            ? "input-primary"
            : "input-error"
        } w-full max-w-xs`}
        placeholder="Enter the name..."
        required
      />

      <div className="flex flex-row">
        <div>
          <h1 className="mt-4 mb-1 text-xl bold text-slate-600">Category</h1>
          <div className="join join-vertical flex mr-8">
            {categories.map((category) => (
              <input
                checked={productEditData.categoryId === category.id}
                onChange={(e) => {
                  onChange({ ...productEditData, categoryId: category.id });
                }}
                className="join-item btn btn-lg w-60"
                type="radio"
                name="category"
                aria-label={category.name}
              />
            ))}
          </div>
        </div>
        <div>
          <h1 className="mt-4 mb-1 text-xl bold text-slate-600">Unit</h1>
          <div className="join join-vertical flex mr-8">
            {units.map((unit) => (
              <input
                checked={productEditData.unitId === unit.id}
                onChange={(e) => {
                  onChange({ ...productEditData, unitId: unit.id });
                }}
                className="join-item btn btn-lg w-60"
                type="radio"
                name="unit"
                aria-label={unit.name}
              />
            ))}
          </div>
        </div>
        <div className="flex">
          <div>
            <h1 className="mt-4 mb-1 text-xl bold text-slate-600">
              Expiration Date
            </h1>
            <DayPicker
              mode="single"
              selected={
                productEditData.expirationDate
                  ? moment(productEditData.expirationDate).toDate()
                  : new Date()
              }
              onSelect={(d) =>
                // @ts-ignore
                onChange({
                  ...productEditData,
                  expirationDate: d?.toISOString(),
                })
              }
            />
          </div>
        </div>
      </div>
    </form>
  );
}

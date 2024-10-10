import React from "react";
import { ProductEditData } from "./AddModal";
import { useCategory } from "../providers/CategoryProvider";
import { DatePicker } from "@mantine/dates";
import { useProductTemplate } from "../providers/ProductTemplateProvider";
import moment from "moment";
import { DayPicker } from "react-day-picker";
import { useUnit } from "../providers/UnitProvider";
import NumberInput from "./NumberInput";
import Picker from "react-mobile-picker";
import "react-day-picker/style.css";
import { useStorage } from "../providers/StorageProvider";

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
  const { storages } = useStorage();
  return (
    <>
      <div className="">
        <h1 className="mt-4 mb-1 text-md bold text-slate-600">Name</h1>
        <input
          type="name"
          id="name"
          onChange={(e) =>
            onChange({ ...productEditData, name: e.target.value })
          }
          value={productEditData.name}
          className={`input input-sm ${
            productEditData.name && productEditData.name !== ""
              ? "input-primary"
              : "input-error"
          } w-full max-w-xs`}
          placeholder="Enter the name..."
          required
        />
      </div>
      <div className="flex max-h-[80%] mt-2 justify-between w-full">
        <div className="flex flex-col">
          <div>
            <h1 className=" text-md mb-1  bold text-slate-600">Category</h1>
          </div>
          <div className="flex-1 join join-vertical overflow-y-scroll">
            {categories.map((category) => (
              <input
                checked={productEditData.categoryId === category.id}
                onChange={(e) => {
                  onChange({ ...productEditData, categoryId: category.id });
                }}
                className="join-item btn btn-sm max-w-32"
                type="radio"
                name="category"
                aria-label={category.name}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <div>
            <h1 className=" text-md mb-1  bold text-slate-600">Storage</h1>
          </div>
          <div className="flex-1 join join-vertical overflow-y-scroll">
            {storages.map((storage) => (
              <input
                checked={productEditData.storageId === storage.id}
                onChange={(e) => {
                  onChange({ ...productEditData, storageId: storage.id });
                }}
                className="join-item btn btn-sm max-w-32"
                type="radio"
                name="storage"
                aria-label={storage.name}
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className=" mb-1 text-md text-slate-600">Quantity</h1>
          <NumberInput
            number={productEditData.quantity ?? 0}
            onChange={(n) => onChange({ ...productEditData, quantity: n })}
            unitString={
              units.find((u) => u.id === productEditData.unitId)?.name
            }
          />
        </div>
        <div className="overflow-hidden">
          <Picker
            className=" -translate-y-16"
            value={{ unit: productEditData.unitId ?? "" }}
            onChange={(s) => onChange({ ...productEditData, unitId: s.unit })}
          >
            <Picker.Column name={"unit"}>
              {units.map((unit) => (
                <Picker.Item key={unit.id} value={unit.id}>
                  {unit.name}
                </Picker.Item>
              ))}
            </Picker.Column>
          </Picker>
          {/* <h1 className="mt-10 text-md text-slate-600">Unit</h1>
          <div className="join join-vertical flex mx-auto">
            {units.map((unit) => (
              <input
                checked={productEditData.unitId === unit.id}
                onChange={(e) => {
                  onChange({ ...productEditData, unitId: unit.id });
                }}
                className="join-item btn btn-sm max-w-30"
                type="radio"
                name="unit"
                aria-label={unit.name}
              />
            ))}
          </div> */}
        </div>
        <div>
          {" "}
          <h1 className="mt-4 mb-1 text-md text-slate-600">Expiration Date</h1>
          <DayPicker
            mode="single"
            selected={
              productEditData.expirationDate
                ? moment(productEditData.expirationDate).toDate()
                : new Date()
            }
            className="text-xs"
            classNames={{
              day: "!w-8 !h-8",
              day_button: "!w-8 !h-8",
            }}
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

      {/*  <div className="h-full flex flex-row">
        <div className="flex flex-col">
          <h1 className="mt-4 mb-1 text-xl bold text-slate-600">Category</h1>
          <div className="join join-vertical mr-8 h-1/2 overflow-scroll">
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
          <h1 className="mt-4 mb-1 text-xl bold text-slate-600">Quantity</h1>
          <NumberInput
            number={productEditData.quantity ?? 0}
            onChange={(n) => onChange({ ...productEditData, quantity: n })}
            unitString={
              units.find((u) => u.id === productEditData.unitId)?.name
            }
          />
          <h1 className="mt-4 mb-1 text-lg bold text-slate-600">Unit</h1>
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
        <div className="">
          <div>
           
          </div>
        </div>
      </div> */}
    </>
  );
}

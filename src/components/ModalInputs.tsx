import React, { useState } from "react";
import { useCategory } from "../providers/CategoryProvider";
import { DayPicker } from "react-day-picker";
import { useUnit } from "../providers/UnitProvider";
import "react-day-picker/style.css";
import { useStorage } from "../providers/StorageProvider";
import { ProductCreateData } from "@shelf-mate/api-client-ts";
import moment from "moment";

export interface ModalInputProps<
  T_ProductData extends Partial<ProductCreateData>
> {
  productEditData: T_ProductData;
  onChange: (data: T_ProductData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ModalInputs<T extends Partial<ProductCreateData>>({
  productEditData,
  onChange,
  onSave,
  onCancel,
}: ModalInputProps<T>) {
  const { categories = [] } = useCategory();
  const { units = [] } = useUnit();
  const { storages = [] } = useStorage();

  const [showPickerModal, setShowPickerModal] = useState(false);
  const [pickerTitle, setPickerTitle] = useState<string>("");
  const [pickerItems, setPickerItems] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedField, setSelectedField] = useState<keyof T | "">("");
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const openPicker = (
    title: string,
    items: { id: string; name: string }[],
    field: keyof T
  ) => {
    setPickerTitle(title);
    setPickerItems(items);
    setSelectedField(field);
    setShowPickerModal(true);
  };

  const handleItemSelect = (id: string) => {
    if (selectedField) {
      onChange({ ...productEditData, [selectedField]: id });
    }
    setShowPickerModal(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow overflow-auto p-1">
        {/* Name Input */}
        <div>
          <h1 className="text-md font-semibold text-slate-600 mb-1">Name</h1>
          <input
            type="text"
            id="name"
            value={productEditData.name || ""}
            onChange={(e) =>
              onChange({ ...productEditData, name: e.target.value })
            }
            className="input input-md w-full border rounded-md p-2"
            placeholder="Enter the name..."
          />
        </div>

        {/* Quantity Input */}
        <div>
          <h1 className="text-md font-semibold text-slate-600 mb-1">
            Quantity
          </h1>
          <input
            type="number"
            value={productEditData.quantity || 0}
            onChange={(e) =>
              onChange({ ...productEditData, quantity: Number(e.target.value) })
            }
            className="input input-md w-full border rounded-md p-2"
          />
        </div>
        {/* Expiration Date Picker */}
        <div>
          <h1 className="text-md font-semibold text-slate-600 mb-1">
            Expiration Date
          </h1>
          <input
            type="text"
            readOnly
            value={
              productEditData.expirationDate
                ? moment(productEditData.expirationDate).format("YYYY-MM-DD")
                : "Select expiration date"
            }
            onClick={() => setShowCalendarModal(true)}
            className="input input-md w-full border rounded-md p-2 cursor-pointer"
          />
        </div>
        {/* Unit Input */}
        <div>
          <h1 className="text-md font-semibold text-slate-600 mb-1">Unit</h1>
          <input
            type="text"
            readOnly
            value={
              units.find((u) => u.id === productEditData.unitId)?.name ||
              "Select a unit"
            }
            onClick={() => openPicker("Select Unit", units, "unitId")}
            className="input input-md w-full border rounded-md p-2 cursor-pointer"
          />
        </div>
        {/* Storage Input */}
        <div>
          <h1 className="text-md font-semibold text-slate-600 mb-1">Storage</h1>
          <input
            type="text"
            readOnly
            value={
              storages.find((s) => s.id === productEditData.storageId)?.name ||
              "Select a storage"
            }
            onClick={() => openPicker("Select Storage", storages, "storageId")}
            className="input input-md w-full border rounded-md p-2 cursor-pointer"
          />
        </div>
        {/* Category Input */}
        <div>
          <h1 className="text-md font-semibold text-slate-600 mb-1">
            Category
          </h1>
          <input
            type="text"
            readOnly
            value={
              categories.find((c) => c.id === productEditData.categoryId)
                ?.name || "Select a category"
            }
            onClick={() =>
              openPicker("Select Category", categories, "categoryId")
            }
            className="input input-md w-full border rounded-md p-2 cursor-pointer"
          />
        </div>
      </div>

      {/* Picker Modal */}
      {showPickerModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full text-center">
            <h2 className="text-lg font-semibold mb-4">{pickerTitle}</h2>
            <div className="h-48 overflow-y-scroll">
              {pickerItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemSelect(item.id)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {item.name}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowPickerModal(false)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showCalendarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs sm:max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-4">
              Select Expiration Date
            </h2>
            <div className="overflow-hidden">
              <DayPicker
                mode="single"
                selected={
                  productEditData.expirationDate
                    ? moment(productEditData.expirationDate).toDate()
                    : undefined
                }
                onSelect={(date) => {
                  onChange({
                    ...productEditData,
                    expirationDate: date || undefined,
                  });
                  setShowCalendarModal(false);
                }}
                className="w-full"
              />
            </div>
            <button
              onClick={() => setShowCalendarModal(false)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { FaDeleteLeft } from "react-icons/fa6";
interface NumberInputProps {
  number: number;
  onChange?: (number: number) => void;
  unitString?: string;
}

export default function NumberInput({
  number,
  onChange,
  unitString,
}: NumberInputProps) {
  const numbers = [
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
  ];

  return (
    <>
      <h1 className="font-extrabold text-2xl mb-1 text-end">{number}</h1>
      <div className="join">
        {numbers.map((col, i) => (
          <div key={i} className="join join-item join-vertical">
            {col.map((n) => (
              <button
                key={n}
                className="btn btn-md join-item"
                onClick={() => onChange?.(parseInt(String(number) + String(n)))}
              >
                {n}
              </button>
            ))}
          </div>
        ))}
        <div className="join join-item join-vertical">
          <button
            className="btn btn-md btn-square join-item"
            onClick={() => onChange?.(parseInt(String(number) + String(0)))}
          >
            0
          </button>
          <button
            className="btn btn-md btn-square join-item"
            onClick={() =>
              onChange?.(
                parseInt(
                  String(number).substring(0, String(number).length - 1) || "0"
                )
              )
            }
          >
            <FaDeleteLeft />
          </button>

          <button
            className="btn btn-md btn-square join-item"
            onClick={() => onChange?.(number + 100)}
          >
            +100
          </button>
        </div>
      </div>
    </>
  );
}

import type { MarTreeLinks } from "../types";
import type React from "react";

type MarTreeInputsProps = {
  item: MarTreeLinks;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEnableLinks: (socialNetwork: string) => void;
};

export default function MarTreeInputs({
  item,
  handleUrlChange,
  handleEnableLinks
}: MarTreeInputsProps) {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg flex items-center gap-4">
      
      <div
        className="w-12 h-12 bg-cover bg-center rounded-md flex-shrink-0"
        style={{ backgroundImage: `url(/social/icon_${item.name}.svg)` }}
      />

      
      <div className="flex-1">
        <div className="relative bg-inherit">
          <input
            type="text"
            id={item.name}
            placeholder={`Enter your ${item.name} URL`}
            className="
              peer bg-transparent h-10 w-full rounded-md px-3
              text-gray-800 placeholder-transparent
              ring-1 ring-gray-300
              focus:ring-2 focus:ring-sky-500
              focus:outline-none transition
            "
            value={item.url}
            onChange={handleUrlChange}
            name={item.name}
          />
          <label
            htmlFor={item.name}
            className="
              absolute left-3 -top-2 text-xs text-gray-500
              bg-white px-1 transition-all
              peer-placeholder-shown:text-sm
              peer-placeholder-shown:text-gray-400
              peer-placeholder-shown:top-2.5
              peer-focus:-top-2
              peer-focus:text-xs
              peer-focus:text-sky-600
            "
          >
            {item.name} URL
          </label>
        </div>
      </div>

      
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={item.enabled}
          onClick={() => handleEnableLinks(item.name)}
          readOnly
        />

        <div
          className="
            h-6 w-11 rounded-full bg-slate-200 border
            after:absolute after:left-[2px] after:top-0.5
            after:h-5 after:w-5 after:rounded-full
            after:bg-white after:border after:transition-all
            peer-checked:bg-[linear-gradient(60deg,_rgb(64,_180,_140),_rgb(72,_160,_200),_rgb(96,_140,_220),_rgb(110,_120,_210),_rgb(130,_110,_200),_rgb(150,_120,_210))]
            peer-checked:after:translate-x-full
          "
        />
      </label>
    </div>
  );
}

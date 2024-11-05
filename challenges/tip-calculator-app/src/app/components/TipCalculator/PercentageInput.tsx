"use client";

const VALID_PERCENTAGE_REGEX = "^\\d|[1-9]\\d+$";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

function isValidPercentage(value: string) {
  return value.match(new RegExp(VALID_PERCENTAGE_REGEX)) != null;
}

interface PercentageInputProps {
  id?: string;
  value: string;
  placeholder?: string;
  className?: string;
  onChange: (value: number) => void;
}

export default function PercentageInput({
  id,
  value,
  placeholder = "",
  className = "",
  onChange,
}: PercentageInputProps) {
  const [hasFocus, setHasFocus] = useState(false);

  const isEmpty = !value || value === "0";
  const displayValue = isEmpty ? "" : value + (hasFocus ? "" : "%");

  return (
    <input
      id={id}
      type='tel'
      pattern={VALID_PERCENTAGE_REGEX}
      className={twMerge(`
        ${hasFocus ? "pr-3" : ""}
        rounded-[5px]
        ${isEmpty ? "bg-[#F3F9FA]" : "bg-[#26C2AE]"}
        focus:bg-white
        ${hasFocus ? "text-[#547878]" : ""}
        ${isEmpty ? "text-right" : "text-center"}
        focus:text-right
        outline-8 outline-[#26C2AE]
        placeholder-[#547878] 
        caret-[#26C2AE]
        ${className || ""}
      `)}
      placeholder={placeholder}
      value={displayValue}
      onFocus={() => {
        setHasFocus(true);
      }}
      onBlur={() => {
        setHasFocus(false);
      }}
      onChange={(e) => {
        const value = e.target.value || "";
        if (value === "") {
          // allow empty value
          onChange(0);
          return;
        }
        if (!isValidPercentage(value)) {
          e.preventDefault();
          return;
        }
        onChange(parseFloat(value));
      }}
    />
  );
}

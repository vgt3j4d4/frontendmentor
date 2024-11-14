import { useMemo, useState } from "react";

const VALID_PERCENTAGE_REGEX = "^\\d|[1-9]\\d+$";

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
  const baseClassName = useMemo(() => {
    return `
        rounded-[5px]
        focus:bg-white focus:text-right
        outline-8 outline-[#26C2AE]
        placeholder-[#547878] 
        caret-[#26C2AE]
        ${
          isEmpty
            ? `pr-4 ${hasFocus ? "" : "lg:pr-0"} bg-[#F3F9FA] text-right`
            : `${hasFocus ? "pr-4" : ""} bg-[#26C2AE] text-center`
        } ${hasFocus ? "text-[#547878]" : ""}`;
  }, [isEmpty, hasFocus]);

  return (
    <input
      id={id}
      type='tel'
      pattern={VALID_PERCENTAGE_REGEX}
      className={`${baseClassName} ${className || ""}`}
      placeholder={placeholder}
      value={displayValue}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
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

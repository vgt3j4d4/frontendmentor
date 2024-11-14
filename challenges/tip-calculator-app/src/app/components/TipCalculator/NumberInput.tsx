import { DECIMAL_PLACES } from "@/app/constants";
import { useMemo } from "react";

const INVALID_NUMBER_KEYS = ["+", "-"];

interface NumberInputProps {
  id?: string;
  value: string;
  decimalPlaces?: number;
  placeholder?: string;
  className?: string;
  autofocus?: boolean;
  onChange: (value: number) => void;
  onBlur?: () => void;
}

export default function NumberInput({
  id,
  value,
  decimalPlaces = DECIMAL_PLACES,
  placeholder = "",
  className = "",
  autofocus = false,
  onChange,
  onBlur = () => {},
}: NumberInputProps) {
  const validationRegex = useMemo(() => {
    return decimalPlaces && decimalPlaces !== 0
      ? new RegExp(`^(?!0)\\d+(\\.\\d{1,${decimalPlaces}})?$`)
      : new RegExp(`^[1-9]+\\d*$`);
  }, [decimalPlaces]);
  const isEmpty = !value || value === "0";
  const displayValue = isEmpty ? "" : value;

  return (
    <input
      id={id}
      type='number'
      className={`w-full
        py-2 pl-9 pr-4
        rounded-[5px] 
        bg-[#F3F9FA] bg-no-repeat
        text-2xl font-bold text-[#00474B] text-right
        outline-8
        ${className}
        `}
      value={displayValue}
      placeholder={placeholder}
      autoFocus={autofocus}
      onKeyDown={(e) => {
        // For some reason, type="number" allows these keys
        if (INVALID_NUMBER_KEYS.includes(e.key)) {
          e.preventDefault();
          return;
        }
        // If decimal places are 0, prevent user from adding a decimal point
        if (e.key === "." && decimalPlaces === 0) {
          e.preventDefault();
          return;
        }
      }}
      onChange={(e) => {
        const value = e.target.value || "";
        const parsedValue = parseFloat(value);
        if (value === "" && isNaN(parsedValue)) {
          // Catching empty and NaN values
          onChange(0);
          return;
        }
        if (value.endsWith(".") && decimalPlaces !== 0) {
          // Allow user to add a decimal point if decimal places are not 0
          return;
        }
        if (validationRegex.test(value)) onChange(parsedValue);
      }}
      onBlur={onBlur}
    />
  );
}

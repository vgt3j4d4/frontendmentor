import { twMerge } from "tailwind-merge";

interface NumberInputProps {
  id?: string;
  icon?: "dollar" | "person";
  value: string;
  decimalPlaces?: number;
  placeholder?: string;
  className?: string;
  autofocus?: boolean;
  onChange: (value: number) => void;
}

export default function NumberInput({
  id,
  icon = "dollar",
  value,
  decimalPlaces = 2,
  placeholder = "",
  className = "",
  autofocus = false,
  onChange,
}: NumberInputProps) {
  const isEmpty = !value || value === "0";
  const displayValue = isEmpty ? "" : value;
  const iconClassName =
    icon === "dollar" ? "bg-image-dollar" : "bg-image-person";

  return (
    <input
      id={id}
      type='tel'
      pattern={`^(\\[1-9]+(\\.\\d{1,${decimalPlaces}})?)$`}
      className={
        twMerge(`
        w-full
        py-2 pl-9 pr-4
        rounded-[5px] 
        bg-[#F3F9FA] bg-no-repeat
        text-2xl font-bold text-[#00474B] text-right
        outline-8
        ${className || ""}
      `) + ` ${iconClassName}`
      }
      placeholder={placeholder}
      value={displayValue}
      autoFocus={autofocus}
      onChange={(e) => {
        const value = e.target.value || "";
        if (value === "") {
          // allow empty value
          onChange(0);
          return;
        }
        onChange(parseFloat(value));
      }}
    />
  );
}

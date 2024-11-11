import { TipCalculatorParams } from "@/app/contexts/TipCalculatorContext";
import { useMemo } from "react";

interface TipButtonProps {
  value: number;
  displayValue: string;
  tipPercentage: number;
  customPercentage?: boolean;
  params: TipCalculatorParams;
  setParams: (params: TipCalculatorParams) => void;
}

export default function TipButton({
  value,
  displayValue,
  tipPercentage,
  customPercentage = false,
  params,
  setParams,
}: TipButtonProps) {
  const isActive = useMemo(() => {
    return !customPercentage && tipPercentage === value;
  }, [customPercentage, tipPercentage, value]);

  return (
    <button
      type='button'
      className={`h-full px-4 py-2 bg-[#00474B] ${
        isActive ? "bg-[#26C2AE]" : "hover:bg-[#9FE8DF]"
      }
        text-center text-white
        rounded-md
        outline-8 outline-offset-2 outline-yellow-500
        ring-offset-2 ring-yellow-500 focus:ring-2`}
      onClick={() => {
        setParams({
          ...params,
          customPercentage: false,
          tipPercentage: value,
        });
      }}
    >
      {displayValue}
    </button>
  );
}

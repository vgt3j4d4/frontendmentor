import { TipCalculatorParams } from "@/app/contexts/TipCalculatorContext";

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
  return (
    <button
      type='button'
      className={`h-full px-4 py-2 bg-[#00474B] ${
        !customPercentage && tipPercentage === value ? "bg-[#26C2AE]" : ""
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

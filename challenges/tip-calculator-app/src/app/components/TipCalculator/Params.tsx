import { useContext, useRef } from "react";
import { TipCalculatorContext } from "@/app/contexts/TipCalculatorContext";
import TipSelector from "@/app/components/TipCalculator/TipSelector";
import NumberInput from "@/app/components/TipCalculator/NumberInput";

export default function Params() {
  const { params, setParams } = useContext(TipCalculatorContext);
  const numberOfPeopleTouched = useRef(false);

  return (
    <form
      action='#'
      className='flex flex-col gap-8 lg:gap-10 lg:w-[23.68rem] px-2 lg:px-0'
      noValidate={true}
    >
      <div>
        <label
          className='block mb-[6px] font-bold text-[#5e7a7d]'
          htmlFor='bill'
        >
          Bill
        </label>
        <NumberInput
          id='bill'
          className='bg-image-dollar bg-[length:11px_17px] bg-left_20-center outline-[#26c2ae]'
          placeholder='0'
          value={params.bill + "" || ""}
          autofocus={true}
          onChange={(value: number) => {
            setParams({
              ...params,
              bill: value,
            });
          }}
        ></NumberInput>
      </div>

      <div>
        <label className='block mb-4 font-bold text-[#5e7a7d]' htmlFor='tip'>
          Select Tip %
        </label>
        <TipSelector />
      </div>

      <div>
        <div className='flex items-center justify-between mb-2'>
          <label
            className='block font-bold text-[#5e7a7d]'
            htmlFor='number-of-people'
          >
            Number of People
          </label>
          <span
            className={`text-sm lg:text-base font-bold text-[#e17457] ${
              numberOfPeopleTouched.current && params.numberOfPeople == 0
                ? ""
                : "hidden"
            }`}
          >
            Can&apos;t be zero
          </span>
        </div>
        <NumberInput
          id='number-of-people'
          className={`bg-image-person bg-[length:13px_16px] bg-left_20-center ${
            numberOfPeopleTouched.current && params.numberOfPeople === 0
              ? "outline-[#e17052]"
              : "outline-[#26c2ae]"
          }`}
          placeholder='0'
          value={params.numberOfPeople + "" || ""}
          decimalPlaces={0}
          onChange={(value) => {
            numberOfPeopleTouched.current = true;
            setParams({
              ...params,
              numberOfPeople: value,
            });
          }}
        ></NumberInput>
      </div>
    </form>
  );
}

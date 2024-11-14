import { useContext } from "react";
import { TipCalculatorContext } from "@/app/contexts/TipCalculatorContext";

import { EMPTY_TIP_VALUE } from "@/app/constants";

interface TipCalculatorResultsProps {
  currencySymbol?: string;
}

function Results({ currencySymbol = "$" }: TipCalculatorResultsProps) {
  const { results, resetForm } = useContext(TipCalculatorContext);
  const tipPerPerson = results.tipPerPerson || EMPTY_TIP_VALUE;
  const total = results.total || EMPTY_TIP_VALUE;

  return (
    <div
      className='flex flex-col gap-[20px] w-full lg:w-[413px] p-6 lg:p-10 bg-[#00474B] rounded-2xl'
      aria-live='polite'
    >
      <div className='flex justify-between items-center flex-wrap'>
        <span className='font-bold'>
          Tip Amount
          <em
            className='block text-[#7F9D9F] text-sm font-bold not-italic'
            aria-label='per person'
          >
            / person
          </em>
        </span>
        <span
          className='text-3xl lg:text-5xl font-bold text-[#26C2AE]'
          aria-label={`${tipPerPerson} dollars`}
        >
          {currencySymbol}
          {tipPerPerson}
        </span>
      </div>
      <div className='flex justify-between items-center flex-wrap mt-5'>
        <span className='font-bold'>
          Total
          <em
            className='block text-[#7F9D9F] text-sm font-bold not-italic'
            aria-label='per person'
          >
            / person
          </em>
        </span>
        <span
          className='text-3xl lg:text-5xl font-bold text-[#26C2AE]'
          aria-label={`${total} dollars`}
        >
          {currencySymbol}
          {total}
        </span>
      </div>
      <button
        type='button'
        className='mt-8 lg:mt-auto py-[9px] rounded-md 
        bg-[#26C2AE] hover:bg-[#9FE8DF]
        text-xl text-[#00474B]
        font-bold uppercase
        outline-8 outline-offset-2 outline-yellow-500
        disabled:bg-[#0D686D] disabled:text-[#00474B]'
        disabled={results.total === 0}
        onClick={resetForm}
      >
        Reset
      </button>
    </div>
  );
}

// TODO: use memo
export default Results;

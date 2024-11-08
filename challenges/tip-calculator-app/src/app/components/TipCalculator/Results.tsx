import { useContext } from "react";
import { TipCalculatorContext } from "@/app/contexts/TipCalculatorContext";

import { EMPTY_TIP_VALUE } from "@/app/constants";

interface TipCalculatorResultsProps {
  currencySymbol?: string;
}

function Results({ currencySymbol = "$" }: TipCalculatorResultsProps) {
  const { results, resetForm } = useContext(TipCalculatorContext);

  return (
    <div className='flex flex-col gap-6 w-full lg:w-[413px] p-6 lg:p-10 bg-[#00474B] rounded-2xl'>
      <div className='flex justify-between items-center flex-wrap'>
        <span>
          Tip Amount
          <em className='block text-[#7F9D9F] text-sm font-bold not-italic'>
            / person
          </em>
        </span>
        <span className='text-3xl lg:text-5xl font-bold text-[#26C2AE]'>
          {currencySymbol}
          {results.tipPerPerson || EMPTY_TIP_VALUE}
        </span>
      </div>
      <div className='flex justify-between items-center flex-wrap mt-5'>
        <span>
          Total
          <em className='block text-[#7F9D9F] text-sm font-bold not-italic'>
            / person
          </em>
        </span>
        <span className='text-3xl lg:text-5xl font-bold text-[#26C2AE]'>
          {currencySymbol}
          {results.total || EMPTY_TIP_VALUE}
        </span>
      </div>
      <button
        type='button'
        className='mt-8 lg:mt-auto py-2 rounded-md 
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

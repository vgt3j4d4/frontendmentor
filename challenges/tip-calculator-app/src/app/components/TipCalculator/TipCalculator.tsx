"use client";

import TipCalculatorProvider from "@/app/contexts/TipCalculatorContext";
import Params from "@/app/components/TipCalculator/Params";
import Results from "@/app/components/TipCalculator/Results";

export default function TipCalculator() {
  return (
    <TipCalculatorProvider>
      <div className='flex flex-col items-stretch lg:flex-row justify-between gap-8 max-w-96 lg:max-w-max lg:w-[920px] py-8 px-6 lg:p-8 lg:pl-12 bg-white rounded-3xl'>
        <Params />
        <Results />
      </div>
    </TipCalculatorProvider>
  );
}

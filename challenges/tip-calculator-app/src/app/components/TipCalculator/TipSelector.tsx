import { useContext } from "react";
import TipButton from "@/app/components/TipCalculator/TipButton";
import { TipCalculatorContext } from "@/app/contexts/TipCalculatorContext";
import PercentageInput from "@/app/components/TipCalculator/PercentageInput";

const TIP_PERCENTAGES = [
  {
    value: 5,
    displayValue: "5%",
  },
  {
    value: 10,
    displayValue: "10%",
  },
  {
    value: 15,
    displayValue: "15%",
  },
  {
    value: 25,
    displayValue: "25%",
  },
  {
    value: 50,
    displayValue: "50%",
  },
];

export default function TipSelector() {
  const { params, setParams } = useContext(TipCalculatorContext);

  return (
    <div className='grid grid-cols-3 gap-y-3 gap-x-4 text-2xl font-bold'>
      {TIP_PERCENTAGES.map(({ value, displayValue }) => (
        <TipButton
          key={value}
          value={value}
          displayValue={displayValue}
          tipPercentage={params.tipPercentage}
          customPercentage={params.customPercentage}
          params={params}
          setParams={setParams}
        />
      ))}
      <PercentageInput
        id='tip'
        value={params.customPercentage ? params.tipPercentage + "" : ""}
        placeholder='Custom'
        className='lg:text-center'
        onChange={(value: number) => {
          setParams({
            ...params,
            customPercentage: true,
            tipPercentage: value,
          });
        }}
      />
    </div>
  );
}

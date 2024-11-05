"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { DECIMAL_PLACES } from "@/app/constants";

export interface TipCalculatorParams {
  bill: number;
  tipPercentage: number;
  customPercentage: boolean;
  numberOfPeople: number;
}

export interface TipCalculatorResults {
  tipPerPerson: number;
  total: number;
}

interface TipCalculatorContextType {
  params: TipCalculatorParams;
  setParams: (params: TipCalculatorParams) => void;
  results: TipCalculatorResults;
  setResults: (results: TipCalculatorResults) => void;
  resetForm: () => void;
}

export const TipCalculatorContext = createContext<TipCalculatorContextType>(
  {} as TipCalculatorContextType
);

export default function TipCalculatorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [params, setParams] = useState({
    bill: 0,
    tipPercentage: 0,
    customPercentage: false,
    numberOfPeople: 0,
  });
  const [results, setResults] = useState({ tipPerPerson: 0, total: 0 });

  useEffect(() => {
    const { bill, tipPercentage, numberOfPeople } = params;
    if (bill === 0 || numberOfPeople === 0) {
      setResults({ tipPerPerson: 0, total: 0 });
      return;
    }
    const tip = (bill * tipPercentage) / 100;
    setResults({
      tipPerPerson: Number((tip / numberOfPeople).toFixed(DECIMAL_PLACES)),
      total: Number(((bill + tip) / numberOfPeople).toFixed(DECIMAL_PLACES)),
    });
  }, [params]);

  const resetForm = () => {
    setParams({
      bill: 0,
      tipPercentage: 0,
      customPercentage: false,
      numberOfPeople: 0,
    });
    setResults({ tipPerPerson: 0, total: 0 });
  };

  return (
    <TipCalculatorContext.Provider
      value={{ params, setParams, results, setResults, resetForm }}
    >
      {children}
    </TipCalculatorContext.Provider>
  );
}

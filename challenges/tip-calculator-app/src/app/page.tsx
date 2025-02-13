import Image from "next/image";
import TipCalculator from "@/app/components/TipCalculator/TipCalculator";

export default function Home() {
  return (
    <>
      <header className='header pt-12 pb-10 lg:pt-[10.18rem] lg:pb-[5.37rem]'>
        <Image
          src={"images/logo.svg"}
          alt='Splitter logo'
          width={86.66}
          height={53.14}
          priority={true}
        ></Image>
      </header>
      <main>
        <TipCalculator />
      </main>
    </>
  );
}

import react, { useEffect, useRef, useState } from "react";

import hooks from "../../../../hooks/useSale";


interface prop {
  id?: string
  wind: string;
  round: number;
  nextRound: (value: boolean) => void
}

const Rounds = ({ round, wind, nextRound, id }: prop) => {
  const [cont, setCont] = useState(10)
  const { play, connection } = hooks.useGame();
  const [start, setStart] = useState(false)
  const refTime = useRef<HTMLTimeElement>(null)


  const OnStart = () => {
    id && connection(id, "play", "")
  }

  useEffect(() => {
    play && setStart(true)
  }, [play])

  useEffect(() => {
    const time = refTime.current;
    if (!time) return;

    if (cont >= 0) {
      const timeout = cont === 10 ? 750 : 700;
      time.style.transition = `all ${timeout / 1000}s ease-in-out`;
      time.style.transform = "Scale(2)";
      time.style.opacity = "100%";
      setTimeout(() => {
        time.style.transform = "Scale(1)";
        time.style.opacity = "0%";
      }, timeout);
      const animationEndHandler = () => {
        time.style.transform = "Scale(1)";
        time.style.opacity = "0%";
        time.style.transition = "none";
        setCont((prevCont) => prevCont - 1);
      };
      time.addEventListener("transitionend", animationEndHandler);
      return () => {
        time.removeEventListener("transitionend", animationEndHandler);
      };
    } else {
      nextRound(false);
    }
  }, [start, cont]);

  return (
    <>
      <div className="flex flex-col  justify-center items-center w-[200px] h-[200px] lg:w-[400px] lg:h-[400px] overflow-hidden shadow-lg  bg-white rounded-full" >
        {
          start ?
            <time ref={refTime} className={`text-[100px] py-10 font-bold `}>
              {cont}
            </time> :
            <button

              className={`text-3xl lg:text-[${round ? "95px" : "100px"}] font-bold`}
              onClick={OnStart}
            >
              {round ? "NEXT ROUND!" : "START"}
            </button>
        }
      </div>
    </>
  );
};

export default Rounds;

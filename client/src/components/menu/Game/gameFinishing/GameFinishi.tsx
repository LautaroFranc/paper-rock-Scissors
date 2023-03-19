import react, { useEffect, useRef, useState } from "react";
import Confetti from 'react-confetti'
import trophy   from   "../../../../assets/trophy.png"
import "./StyleFinishing.css"

interface prop {
  winResult: string
  wined:Array<string>
}

const GameFinishing = ({ winResult }: prop) => {
  const { width, height } = window.screen

  return (
    <div id="GameFinishing" className="flex justify-center  items-center flex-col absolute left-0 top-0 w-full  h-full">
      {winResult === "win"&&
        <>
          <h1 id="win" className="font-bold text-center text-8xl">WIND</h1>
          <figure>
            <img className="w-[100%]" src={trophy} />
          </figure>      
          <Confetti
            width={width}
            height={height}
          />
        </>
    }
       { winResult === "lose"&&
        <h1 id="lose" className="font-bold text-center text-8xl">LOSE </h1>
      }
      
      { winResult === "tie"&&
        <h1 id="lose" className="font-bold text-center text-8xl">TIE</h1>
      }
    </div>
  );
};


export default GameFinishing;

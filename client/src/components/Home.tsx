import React, { useState } from "react";

import "./homeStyle.css";
import { useNavigate } from "react-router";

const Home = () => {
  let navigation = useNavigate();
  const HandleClick = () => {
    navigation("/Game");
  };

  return (
    <div className="Home">
      <div className="flex justify-center items-center">
        <h2 id="title">Rock,Paper,Scissors</h2>
      </div>
      <div>
        <button
          className="border shadow-lg shadow-slate-400  flex items-center text-center m-4"
          onClick={HandleClick}
        >
          <p className=" text-[24px] px-[10px]  font-bold lg:text-4xl">PLAY</p>
        </button>
      </div>
    </div>
  );
};

export default Home;

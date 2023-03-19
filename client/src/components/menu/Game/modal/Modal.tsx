import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { key, sale } from "../../../../interface/sale";
import { useNavigate } from "react-router";
import hooks from "../../../../hooks/useSale";
import "./StyleModal.css";

const optionData = [
  {
    title: "Search sala",
    key: "searchSale",
  },
  {
    title: "Create sale",
    key: "createSala",
  },
];
type Options = "searchSale" | "createSala";

const Modal = () => {
  const { connection, messages } = hooks.useSale();
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState<string>("");
  const [roomErr, setRoomErr] = useState<sale>();
  const inputRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const ErrRef = useRef<HTMLSpanElement>(null);
  const [option, setOption] = useState({
    searchSale: false,
    createSala: false,
  });

  const heddleOptions = (event: Options) => {
    if (!option.searchSale && !option.createSala)
      setOption({ ...option, [event]: true });

    if (!inputRef.current) return;
    function offOption(input: HTMLDivElement, offOption: Options) {
      const width = window.screen.width;
      input.style.transition = "0.4s all";
      input.style.transform = `translateX(${width}px)`;
      input.addEventListener("transitionend", () => {
        setOption({ ...option, [event]: true, [offOption]: false });
      });
    }

    option.searchSale && offOption(inputRef.current, "searchSale");
    option.createSala && offOption(inputRef.current, "createSala");
  };

  const heddleText = (event: string, type: key) => {
    connection(event, type);
  };

  useEffect(() => {
    if (messages.error) {
      setRoomErr(messages)
      return
    }
    messages.roomId && navigate("/Game/" + messages.roomId);
  }, [messages]);

  useEffect(() => {
    if (roomErr?.error) {
      setTimeout(() => {
        setRoomErr({})

      }, 2000)
    }
  }, [roomErr?.error])
  return (
    <>
      <span ref={ErrRef} className={`border-[5px] p-[5px] ${roomErr?.error ? "flex" : "hidden"} top-0 z-10 bg-slate-50  border-black absolute text-xl font-bold text-black`}>
        {roomErr?.error}
      </span>
      <div className={`fixed  top-[100px] lg:left-0 bg-transparent h-full `}>

        <div className={`bg-transparent  flex flex-wrap items-center`}>
          <div
            id="menu-options"
            className={`flex justify-center  ${option.createSala || option.searchSale ? "hidden lg:flex" : ""
              } items-center w-[350px] h-[70vh] bg-white  mx-[140px]`}
          >

            <div
              ref={itemsRef}
              id="contener-options"
              className="w-[500px] h-[70vh]  bg-slate-700  border-[5px] border-black "
            >
              {optionData.map((item) => {
                return (
                  <li id={`item`} onClick={() => heddleOptions(item.key as Options)}>
                    <p>{item.title}</p>
                  </li>
                );
              })}
            </div>
          </div>

          <span
            onClick={() => {
              setOption({
                searchSale: false,
                createSala: false
              })
            }}
            className={`${option.createSala || option.searchSale ? " block lg:hidden absolute left-0 top-[-70px] mx-10 z-20 bg-white px-2 border-[5px] border-black" : "hidden"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
              <path d="M17.2 4.8c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l2.8 2.8H5c-.6 0-1 .4-1 1s.4 1 1 1h13.6l-2.8 2.8c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l4-4c.4-.4.4-1 0-1.4l-4-4z" />
            </svg>
          </span>
          {option.searchSale && (
            <div
              ref={inputRef}
              id="container-search"
              className="flex flex-col lg:relative lg:flex-row bottom-[200px]"
            >
              <input
                onChange={({ target }) => setTextInput(target.value)}
                type="text"
                placeholder="Room id"
              />
              <button
                className="bg-white  mx-5 p-[5px] relative top-[200px] lg:top-0 active:animate-pulse text-center border-[1px] border-black"
                onClick={() => heddleText(textInput, "search")}
              >
                Accept
              </button>
            </div>
          )}

          {option.createSala && (
            <div
              ref={inputRef}
              id="container-create"
              className="flex flex-col lg:relative lg:flex-row  top-[100px]"
            >
              <input
                onChange={({ target }) => setTextInput(target.value)}
                type="text"
                placeholder="Room name"
              />
              <button
                className="bg-white text-center relative top-[200px] lg:top-0 active:animate-pulse border-[1px] p-[5px] mx-5 border-black  "
                onClick={() => heddleText(textInput, "sale")}
              >
                Accept
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;

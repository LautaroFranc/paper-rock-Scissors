import react, { useEffect, useRef, useState } from "react";
import "../StyleGame.css";
import hook from "../../../../hooks/useSale";
import onomatopeya from "../../../../assets/onomatopeyas/onomatopeya";
interface props
{ id: string | undefined 
  value:(e:string)=>void
  disabled:boolean
}
const Onomatopeya = ({ id,value,disabled }:props) => {
  const [Onomatopeyas, SetOnomatopeyas] = useState(false);
  const { sendMessage } = hook.useMessages(id);

  const handleOnomatopeyas = (item: string) => {
    sendMessage(item);
    value(item)
  };

  return (
    <>
      <span
        onClick={() =>
          Onomatopeyas ? SetOnomatopeyas(false) : SetOnomatopeyas(true)
        }
        className="mx-4 text-4xl cursor-pointer"
      >
        😎
      </span>
      {Onomatopeyas && (
        <ul className="flex flex-wrap absolute mx-10 overflow-y-auto overflow-x-hidden   my-[-120px] h-[100px] w-[50%] bg-white border-black border-[3px] ">
          {onomatopeya.map((e) => (
            <button
              disabled={disabled}
              className={`w-[20%] cursor-pointer m-2 duration-300 ${disabled?"":"active:scale-[1.1]"}`}
              onClick={() => handleOnomatopeyas(e)}
            >
              <img className={`duration-100 ${disabled? "filter grayscale scale-[0.9]":"hover:scale-[1.1]"}`} src={e} />
            </button>
          ))}
        </ul>
      )}
    </>
  );
};

export default Onomatopeya;

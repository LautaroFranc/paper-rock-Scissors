import react, { Dispatch, useEffect, useRef, useState } from "react";
import hook from "../../../../hooks/useSale";
import "./ReactionOnamatopeyas.css";
import "../StyleGame.css";
import { SetStateAction } from "react";

interface msg {
  messages:{
  message: string
    to: string
    id:string
  }
}

interface items {
  message?: string
    to?: string
    id?:string
  
}

interface props
  { 
    id: string | undefined
    item:string
    setItem:Dispatch<SetStateAction<string>>
    disabled:(value: boolean)=>void
  }



const Reaction = ({ id,item,setItem,disabled }:props) => {
  const { messages }:msg = hook.useMessages(id);
  const [messageTwo , setMessageTwo] = useState<items>({})
  const containerRef = useRef<HTMLDivElement>(null);
  const container2Ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messages.id===messages.to) return setMessageTwo({}) 
 
      
    
  
    const container = container2Ref.current;
    if (!container) return;
    container.style.display = "flex";

    container.style.setProperty (`--animation2-`,"start2")  ;
    container.style.setProperty ('--time2-','0.4s');
    const end = () => {
      container.style.setProperty (`--animation2-`,"end2")  ;
      container.style.setProperty ('--time2-','2s');
      container.addEventListener("animationend", noneAnimation);
      
    };

    const noneAnimation = () => {
        container.style.display = "none";
        setMessageTwo({});
        setItem("")
        
    };

    container.addEventListener("animationend", end);

    return () => {
      container.removeEventListener("animationend", end);
      container.removeEventListener("animationend", noneAnimation);
    };
  }, [messages]);

  useEffect(()=>{
    if(!item)return
    const container = containerRef.current
    if (!container) return;
    disabled(true)
    container.style.display = "flex";
    container.style.setProperty (`--animation-`,"start")  ;
    container.style.setProperty ('--time-','0.4s');

    const end = () => {
      container.style.setProperty (`--animation-`,"end")  ;
      container.style.setProperty ('--time-','2s');
      container.addEventListener("animationend", noneAnimation);
    };

    const noneAnimation = () => {
        container.style.display = "none";
        setItem("")
        setMessageTwo({});
        disabled(false)
    };

    container.addEventListener("animationend", end);
    return () => {
      container.removeEventListener("animationend", end);
      container.removeEventListener("animationend", noneAnimation);
    };
    
  },[item])
  
    useEffect(()=>{      
    const isImage = messages?.message?.includes("/static")

    if (!isImage) return
        if (messages.id!==messages.to && messageTwo.message!==messages.message){ 
      
          setMessageTwo({});
          setMessageTwo(messages)
        }

    },[messages])


  return (
    <>
        <figure id="container" ref={containerRef} className={`absolute  top-0 left-0 w-[50%]`}>
          <img  src={item} className="w-[50%] " />
        </figure>
        <figure id="container2" ref={container2Ref} className={`absolute  top-0  right-0  w-[50%]`}>
          <img  src={messageTwo.message} className="w-[50%] " />
        </figure>
        
    </>
  );
};

export default Reaction;

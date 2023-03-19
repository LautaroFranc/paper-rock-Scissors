import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { sale,key } from "../interface/sale";
const NEW_CHAT_MESSAGE_EVENT = "chat";
const SOCKET_SERVER_URL = "http://localhost:3001";
let socket = socketIOClient(SOCKET_SERVER_URL)

const useMessages = (messageId:string|undefined) => {
  const [messages, setMessages] = useState<any>({});

  useEffect(() => {
    if (!messageId) return
    const onMessage = ({body,to,key}: {body:string, to:string,key:number}) => {
        setMessages({message:body,to,id:socket.id, key });
    }
    socket.on(NEW_CHAT_MESSAGE_EVENT,onMessage)
    return () => {
      socket.off(NEW_CHAT_MESSAGE_EVENT,onMessage)

    };
  }, [messageId]);

  const sendMessage = (messageBody: any) => {
    socket.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      id:messageId,
    });
  };
  return { messages, sendMessage };
};


const useSale = () => {
  const [messages, setMessages] = useState<sale>({});

  const connection = (roomId:string,type:key) => {
    socket.emit(type,roomId)
  };

  useEffect(() => { 
    const room =(message:sale) => {
      setMessages(message);
    }

    socket.on("success", room)
    socket.on("roomError", room)
    return () => {
     socket.off("success", room)
    socket.on("roomError", room)
    
    };

  },[]);

 
  return { messages, connection };
};





const useGame = () => {
  const [result, setgame] = useState<{body?:string,to?:string}>({});
  const [play, setPlay] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const connection = (roomId:string,type:string,data:string|boolean) => {
    socket.emit(type, {
      body: data,
      id:roomId,
    });
  };

  useEffect(() => { 
    setgame({});

    const room =(message:{body:string,to:string}) => {
      setgame(message);
    }
    const play =(message:string) => {
      setPlay(message);
    }
    const loading =(message:boolean) => {
      setLoading(message);
    }
      socket.on("success", room)
      socket.on("play", play)
      socket.on("loading", loading)
 
    
    return () => {
      socket.off("success", room)
      socket.off("play", play)
      socket.off("loading", loading)
    };

  },[]);

 
  return { result,play, loading,connection };
};
 


export default {useMessages,useSale,useGame};
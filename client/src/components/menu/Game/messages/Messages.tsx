import react, {
  FormEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import hook from "../../../../hooks/useSale";
import { msg } from "../../../../interface/message";
import "./MessageStyle.css";
interface chat {
  messages: string;
  key: number;
  id: number;
}

const Messages = ({ id }: { id: string | undefined }) => {
  const refBoxChat = useRef<HTMLDivElement>(null);
  const Regex = /\.(png|jpg|gif)$/i;
  const [getMsg, setMsg] = useState(false);
  const [chat, setChat] = useState<chat[]>([]);
  const [value, setValue] = useState("");
  const { messages, sendMessage }: msg = hook.useMessages(id);
  const handleMessage = (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    sendMessage(value);
    setValue("");
  };

  useLayoutEffect(() => {
    chat.length&&localStorage.setItem("chat",JSON.stringify({chat, id}))
    scrollMessage("smooth");
  }, [chat]);

  useLayoutEffect(() => {
    let localChat = JSON.parse(localStorage.getItem("chat") || `[]`)
    if (localChat.id===id) {
      setChat(localChat?.chat)      
    }else{
     clearChat(); 
    }
    scrollMessage("smooth");
  }, []);



  useEffect(() => {
    if (messages.message) {
      const id = messages.to === messages.id ? 1 : 0;
      setChat([...chat, { messages: messages.message, key: messages.key, id }]);
    }
  }, [messages]);

  useEffect(() => {
    scrollMessage("auto");
  }, [getMsg]);

  function scrollMessage(scrollType:"smooth"|"auto" ) {
    if (!refBoxChat.current) return;
    refBoxChat.current.scroll({
      top: refBoxChat.current.scrollHeight,
      behavior: scrollType,
    });
  }

  function clearChat(){
    setChat([])
    localStorage.removeItem("chat")
  }

  return (
    <div className="absolute bottom-0 left-0 z-10">
      {getMsg ? (
        <div
          id="modalMessage"
          className="flex flex-col h-[93vh] lg:m-[40px] shadow-2xl mx-2 border-black border-[5px] bg-white "
        >
          <div className="flex flex-row justify-between">
            <span
              onClick={() => setMsg(false)}
              className="m-1 text-[18px] py-1  text-center bg-red-500 w-6 cursor-pointer text-white"
            >
              X
            </span>
            
            <span
              onClick={() => clearChat()}
              className="m-1 py-1 text-[18px] bg-red-500 px-2 w-fit cursor-pointer text-white"
            >
              clear message
            </span>
          </div>
          <div
            ref={refBoxChat}
            id="contener_msg"
            className="h-[100vh]  shadow-inner  p-2 w-[100%] overflow-x-auto"
          >
            {chat.map((msg, i) => {
              const isImage = Regex.test(msg.messages);
              const containerId = msg.id ? "user-1-msg" : "user-2-msg";
              const messageId = msg.id ? "text-1-msg" : "text-2-msg";
              return (
                <div
                  key={i}
                  className={`flex ${msg.id ? "" : "justify-end"} items-center w-[100%]`}
                >
                  <span id={!isImage ? containerId : ""}>
                    {isImage ? (
                      <figure className={`rounded-lg w-[300px] overflow-hidden border-[5px] border-black shadow-md m-5 p-0 `}>
                        <img
                          className={`object-cover ${msg.id ? "object-left" : "object-right"
                            } `}
                          src={msg.messages}
                        />
                      </figure>

                    ) : (
                      <>
                        <img
                          className={`rounded-lg absolute w-[60px] shadow-xl h-[60px] top-3 ${msg.id ? "left-1" : "right-0"
                            }`}
                          src={
                            msg.id
                              ? "https://picsum.photos/200/300?random=1"
                              : "https://picsum.photos/200/300?random=2"
                          }
                        />
                        <p id={messageId}>{msg.messages}</p>
                      </>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          <form
            onSubmit={handleMessage}
            className="flex justify-center items-center"
          >
            <input
              type="text"
              className="border-black border-[1px] px-2 mx-[10px] my-1"
              onChange={({ target }) => setValue(target.value)}
              value={value}
            />
            <button
              type="submit"
              className="border-black border-[1px] px-2 mx-5"
            >
              Enviar
            </button>
          </form>
        </div>
      ) : (
        <div onClick={() => setMsg(true)} id="chat-icon">
          <p className="animate-pulse text-center">
            {messages?.message?.includes("/static") ? "⚆_⚆" : messages?.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;

import react, { useEffect, useRef, useState } from "react";
import "./StyleGame.css";
import papel from "../../../assets/papel.png";
import piedra from "../../../assets/rock.png";
import tijera from "../../../assets/tijera.png";
import Modal from "./modal/Modal";
import Messages from "./messages/Messages";
import { useNavigate, useParams } from "react-router";
import Onomatopeya from "./onomatopeya/Onomatopeya";
import Reaction from "./onomatopeya/Reaction";
import hooks from "../../../hooks/useSale";
import Rounds from "./round/Rounds";
import util from "../../../util/util";
import GameFinishing from "./gameFinishing/GameFinishi";

let game = [
  {
    name: "papel",
    img: papel,
  },
  { name: "tijera", img: tijera },
  {
    name: "piedra",
    img: piedra,
  },
];

let wined: string[] = []

const Game = () => {
  const { roomId } = useParams();
  const { result, loading, connection } = hooks.useGame();
  const navigate = useNavigate();
  const sale = hooks.useSale();
  const [selected, SetSelected] = useState("");
  const [time, setTime] = useState(0);
  const [reactionOnomatopeyas, setReactionOnomatopeyas] = useState("");
  const [Play, setPlay] = useState(false);
  const [OnSelectReaction, setOnSelectReaction] = useState(false);
  const [rounds, setRounds] = useState({ win: "", round: 0, nextRound: true });
  const [resultPlay, setResultPlay] = useState<{ player2?: string }>({
    player2: "",
  });
  const refRange = useRef<HTMLInputElement>(null);

  const OnSelect = (items: string) => {
    if (!roomId) return;
    SetSelected(items);
    connection(roomId, "game", items);
  };

  useEffect(() => {
    if (roomId) {
      sale.connection(roomId, "search")
    }
  }, [])
  useEffect(() => {
    if (sale.messages.error) {
       setPlay(false);
      navigate("/Game");

    }
  }, [sale.messages])

  const OnReaction = (e: string) => {
    setReactionOnomatopeyas(e);
  };

  useEffect(() => {
    if (!roomId) return;
    setResultPlay({ player2: "" })
    SetSelected("")
    setRounds({ ...rounds, win: "" })
    !rounds.nextRound && connection(roomId, "loading", true);
  }, [rounds.nextRound]);

  useEffect(() => {
    if (time === 100 && !selected) OnSelect("");
    if (time == 100 || (resultPlay.player2 && selected)) {
      let result = util(selected, resultPlay.player2);
      wined.push(result)
      setRounds({ ...rounds, win: result });
      setTimeout(() => {
        setRounds({ ...rounds, round: rounds.round + 1, nextRound: true });
        setTime(0);
        roomId && connection(roomId, "loading", false);
      }, 9000);
      return;
    }

    if (!refRange || time >= 100 || rounds.nextRound || !loading) return;
    refRange.current?.style.setProperty(
      "--rangeTime-",
      time > 60 ? "red" : "blue"
    );
    setTimeout(() => {
      setTime((prevCont) => prevCont + 1);
    }, 100);
  }, [time, rounds.nextRound, loading]);

  useEffect(() => {
    setResultPlay({ player2: result.body });
  }, [result]);

  useEffect(() => {
    roomId && setPlay(true);
  }, [roomId]);

  return (
    <div className="flex justify-center bg-white w-screen h-screen">
      {!Play ? (
        <div id="game">
          <Modal />
        </div>
      ) : (
        <>
          <div id="game">
            {rounds.nextRound ? (
              <Rounds
                id={roomId}
                round={rounds.round}
                nextRound={(value) =>
                  setRounds({ ...rounds, nextRound: value })
                }
                wind={rounds.win}
              />
            ) : (<>
              <div className="flex flex-col">
                <div id="time">
                  {loading && <input
                    type={"range"}
                    value={time}
                    ref={refRange}
                    max={100}
                  />}
                </div>
                <section className="flex flex-row flex-wrap lg:flex-nowrap">
                  {loading ?
                    game.map((item) => (
                      <button
                        disabled={selected || time == 100 ? true : false}
                        draggable={false}
                        onClick={() => OnSelect(item.name)}
                        className={`flex justify-center item-center flex-col mx-[100px] `}
                      >
                        <div
                          className={`flex justify-center items-center  backdrop-blur-sm duration-[0.4s] bg-[#ffba01] ${resultPlay.player2 === item.name && selected
                            ? " bg-red-600 shadow-md  shadow-red-400"
                            : " shadow-orange-600"
                            } border-black border-[5px] shadow-lg h-[200px] w-[200px] cursor-pointer ${selected === item.name
                              ? "bg-blue-600 shadow-md shadow-blue-600"
                              : "shadow-orange-600"
                            } ${!selected && "hover:animate-pulse"}
                            ${resultPlay.player2 === selected &&
                              resultPlay.player2 === item.name
                              ? "bg-lime-400 shadow-md shadow-lime-300"
                              : rounds.win == "lose"
                                ? "bg-red-500 shadow-red-400"
                                : rounds.win == "wind" && "bg-green-500 shadow-lime-300"
                            }
                            ${time == 100 && !selected
                              ? "bg-gray-600 shadow-none hover:animate-none"
                              : ""}
                          `}
                        >
                          <img
                            draggable={false}
                            className={`w-[50%] duration-[0.2s]`}
                            src={item.img}
                          />
                        </div>
                        <p className="text-center">{item.name}</p>
                      </button>
                    )) :
                    <span className="bg-white  lg:h-[100px] border-[5px] border-black text-center p-[10px] py-[30px] font-bold">
                      Esperando a tu "amigo"... 🥲
                    </span>
                  }
                  {rounds.win && <GameFinishing winResult={rounds.win} wined={wined} />}
                </section>
              </div>
            </>
            )}
            <Reaction disabled={setOnSelectReaction} setItem={setReactionOnomatopeyas} item={reactionOnomatopeyas} id={roomId} />
          </div>
          {rounds.nextRound && <Messages id={roomId} />}
          <div className="absolute bottom-5 w-full lg:w-[80%] flex justify-end lg:justify-center">
            <Onomatopeya
              value={(e) => {
                OnReaction(e);
              }}
              id={roomId}
              disabled={OnSelectReaction}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Game;

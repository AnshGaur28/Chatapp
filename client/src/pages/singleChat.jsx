import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import EmojiPicker from 'emoji-picker-react';


function SingleChat() {
  const chatContainerRef = useRef(null);
  const jwt = sessionStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [emoji , setEmoji] = useState(false);

  const activityRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!socketRef.current) {
      const socket = io("ws://localhost:3000");
      socketRef.current = socket;
      socket.emit("createRoom", sessionStorage.getItem("token"));
      socket.on("message", async (message) => {
        setMessages((messages) => [...messages, message]);
      });

      socket.on("open", () => {
        console.log("WebSocket connection established.");
      });
      socket.on("activity", (name) => {
        activityRef.textContent = `${name} is typing`;
      });
    }

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (messageInput.trim() !== "") {
      const time = new Date();
      const formattedTime =
        ("0" + time.getHours()).slice(-2) +
        " : " +
        ("0" + time.getMinutes()).slice(-2);
      socketRef.current.send({
        message: messageInput,
        token: jwt,
        time: formattedTime,
      });
    }
    setMessageInput("");
  };
  
  const handleEmojiClick = (emojiData) => {
    setMessageInput(messageInput + emojiData.emoji);
  };
  const handleClose = async () => {
    console.log("Leaving Room");
    socketRef.current.emit("clientLeaveRoom");
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('username')
    navigate("/");
  };
  return (
    <>
      <div
        // style={{
        //   backgroundImage:
        //     "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", // Adjust the path as needed
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        // }}
        className="flex flex-col justify-center items-center min-h-screen bg-gray-200 p-4 flex-grow"
      >
        <h1 className="font-bold text-xl p-2 text-center">Client Chat</h1>
        <div
          // style={{
          //   backgroundImage:
          //     "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", // Adjust the path as needed
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
          // }}
          className="bg-white w-1/2 h-full rounded-lg flex flex-col flex-grow p-3 shadow-2xl"
        >
          <div
            className="chat-container flex flex-col flex-grow h-64 overflow-y-auto"
            ref={chatContainerRef}
          >
            {messages.map((message, index) => {
              return (
                <div className="scroller-item text-md" key={index}>
                  {message && message.username && (
                    <div className="my-2 mx-4">
                      <div
                        className={`flex ${
                          message.role == "client"  ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <span
                          className={`${
                            message.role == "client"
                              ? " row bg-[rgb(226,255,195)] "
                              : "bg-gray-50 "
                          } text-black  rounded-md p-2 `}
                        >
                          {/* {message.username} : {message.content} */}
                          {message.content}

                          <span className="text-xs text-gray-600 ml-5">
                            {message.time}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                  {message && message.username == null && (
                    <div>{message.content}</div>
                  )}
                </div>
              );
            })}

            {emoji && (
              <div className="fixed flex flex-row w-full justify-start bottom-20">
                <div className="flex flex-col mb-2 border-2 border-gray-100 rounded-lg overflow-hidden">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={400}
                    open={emoji}
                  />
                </div>
              </div>
            )}
          </div>
          {/* <div className="z-50 fixed bottom-20 right-65">
            {emoji && (
              <div className="z-50 flex flex-row w-full h-50 justify-end ">
                <div className="flex flex-col mb-2 border-2 border-gray-100 w-80 bg-white rounded-lg overflow-hidden">
                <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={300} open={emoji} /> 
                </div>
              </div>
            )}
          </div> */}
          <div className="flex flex-row h-11 mt-2">
            <button
              className="flex justify-center items-center "
              onClick={() => setEmoji(!emoji)}
            >
              <img
                className=" flex items-end justify-center mx-2 h-[30px] w-[30px]"
                src="/happy.png"
              />
            </button>
            <form
              action=""
              className="flex flex-row h-full w-full"
              onSubmit={onSubmit}
            >
              <input
                type="text"
                placeholder="Type a message..."
                onChange={(e) => setMessageInput(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={messageInput}
              />

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
                onClick={onSubmit}
              >
                Send
              </button>
            </form>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
              onClick={handleClose}
            >
              End
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleChat;

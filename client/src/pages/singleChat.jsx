import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

function SingleChat() {
  const jwt = sessionStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const formRef = useRef(null);
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
  }, []);
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
  const handleClose = async () => {
    console.log("Leaving Room");
    socketRef.current.emit("clientLeaveRoom");
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
        className="flex flex-col justify-center items-center h-screen bg-gray-200 p-4"
      >
        <h1 className="font-bold text-xl p-2 text-center">Client Chat</h1>
        <div
          // style={{
          //   backgroundImage:
          //     "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", // Adjust the path as needed
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
          // }}
          className="bg-white w-1/2 h-full rounded-lg flex flex-col p-3 shadow-2xl"
        >
          <div className="chat-container flex-grow ">
            {messages.map((message, index) => {
              return (
                <div key={index}>
                  {message && message.username && (
                    <div className="my-4 mx-4">
                      <div
                        className={`flex ${
                          sessionStorage.getItem("username") == message.username
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <span
                          className={`${
                            sessionStorage.getItem("username") ==
                            message.username
                              ? " row bg-[rgb(226,255,195)] "
                              : " justify-end bg-gray-50 "
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
          </div>
          <div className="flex flex-row h-11">
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

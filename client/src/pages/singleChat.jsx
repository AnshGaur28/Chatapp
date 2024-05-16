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
      // const message = await e.message;
      socketRef.current.send({ message: messageInput, token: jwt });
      setMessageInput("");
    }
    // formRef.current.reset();
  };
  const handleClose = async () => {
    console.log("Leaving Room");
    socketRef.current.emit("clientLeaveRoom");
    navigate("/");
  };
  // const {
  //   formState: { errors },
  //   register,
  //   handleSubmit,
  // } = useForm();
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="font-bold text-xl p-2 text-center">Chatbot</h1>
        <div className="bg-white shadow-lg rounded-lg w-96 h-96 flex flex-col p-3">
          <div className="chat-container flex-grow">
            <div className="text-lg">
              {messages.map((message, index) => {
                return <div key={index}>{message}</div>;
              })}
            </div>
          </div>

          <div className="flex flex-row h-10">
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
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
              onClick={handleClose}
            >
              End
            </button>
          </div>
        </div>
      </div>

      {/* <div className="m-2 ">
        <div className="messages-container text-lg">
          {messages.map((message, index) => {
            return <div key={index}>{message}</div>;
          })}
        </div>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="message-form"
        >
          <input
            className="border-2 border-gray-300 "
            type="text"
            {...register("message", { required: true })}
            placeholder="Type your message..."
          />
          {errors?.type == "required" && <p>Provide an input</p>}
          <button
            type="submit"
            className="border-2 p-2 m-2 bg-blue-500 hover:bg-blue-400 rounded-lg"
          >
            Send
          </button>
        </form>
        <p ref={activityRef} className="activity"></p>
      </div>
      <button
        className="border-2 p-2  bg-red-600 hover:bg-red-400 rounded-lg"
        onClick={handleClose}
      >
        End chat
      </button> */}
    </>
  );
}

export default SingleChat;

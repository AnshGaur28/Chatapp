import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const Chatbox = ({ user, setUser }) => {
  const { SID } = user;
  const roomId = `room_${SID}`;
  console.log("room id", roomId);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socketRef = useRef(null);
  const navigate = useNavigate();

  // const socketSetUpOnce = useRef(false);

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io("ws://localhost:3000");
      socketRef.current = socket;
      const token = sessionStorage.getItem("token");
      console.log(token);
      socket.emit("joinRoom", { roomId: roomId, token: token });
      socketRef.current.on("message", async (message) => {
        setMessages((messages) => [...messages, message]);
      });
      const getMessageHistory = async () => {
        const response = await axios.get(
          "http://localhost:3000/admin/getRoomHistory",
          { params: { roomId: roomId } }
        );
        console.log(
          "Admin chat panel",
          response.data.historyMessages,
          response.data.username
        );

        setMessages((messages) => [
          ...messages,
          ...response.data.historyMessages,
        ]);
      };
      getMessageHistory();
    }
  }, [roomId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageInput.trim() !== "") {
      // Send message to the room
      socketRef.current.emit("adminMessage", {
        message: messageInput,
        roomId: roomId,
        token: sessionStorage.getItem("token"),
      });
      setMessageInput("");
    }
  };
  const handleClose = async () => {
    console.log("Leaving Room");
    socketRef.current.emit("leaveRoom", roomId);
    setUser(null);
    navigate("/dashboard");
  };
  const handleTransfer = async () => {
    console.log("Leaving Room");
    socketRef.current.emit("transferRoom", roomId);
    setUser(null);
    navigate("/dashboard");
  };

  return (
    <>
      {/* <h1>Currently chatting with {user.username}</h1> */}

      <div className="chat-container flex-grow">
        <div className="text-lg">
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
      </div>

      <div className="flex flex-row h-10">
        <input
          type="text"
          value={messageInput}
          placeholder="Type a message..."
          onChange={(e) => setMessageInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
          onClick={handleSubmit}
        >
          Send
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
          onClick={handleClose}
        >
          End
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
          onClick={handleTransfer}
        >
          Transfer
        </button>
      </div>
    </>
  );
};
export default Chatbox;

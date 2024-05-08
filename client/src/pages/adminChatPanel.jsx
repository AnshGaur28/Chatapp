import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";

function AdminChatPanel() {
  const { roomId } = useParams(); 
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socketRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const socket = io("ws://localhost:3000");
    socketRef.current = socket;
    socket.emit("joinRoom", roomId);
    socket.on("message" , async (message)=>{
        setMessages(messages => [...messages , message]);
    });
    return () => {
        socket.off('message');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageInput.trim() !== "") {
      // Send message to the room
      socketRef.current.emit("adminMessage", {message : messageInput , roomId : roomId} );
      setMessageInput("");
    }
  };
  const handleClose = async ()=>{
    socketRef.current.emit("closeRoom" , roomId);
    navigate('/dashboard');
  }

  return (
    <div className="m-2">
      <h1 className="font-bold text-xl p-2">Admin Chat Panel</h1>
      <div className="text-lg">
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="border-2 border-gray-300"
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="border-2 p-2 m-2 bg-blue-500 hover:bg-blue-400 rounded-lg" type="submit">Send</button>
      </form>
      <button className="border-2 p-2  bg-red-600 hover:bg-red-400 rounded-lg" onClick={()=>{ handleClose}}>End chat</button>
    </div>
  );
}

export default AdminChatPanel;

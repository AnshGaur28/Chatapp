import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
const Chatbox = ({ user, setUser }) => {
  const { SID } = user;
  const roomId = `room_${SID}`;
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [transfer , setTransfer] = useState(false);
  const [admins , setAdmins] = useState([]);

  const openAdminPanel = async ()=>{
    setInterval(async()=>{
      const response = await axios.get('http://localhost:3000/admin/getAdmins');
      setAdmins(response.data.admins);
    },1000);
    setTransfer(true);
  }
  const closeAdminPanel = async ()=>{
    setTransfer(false);
  }


  // const socketSetUpOnce = useRef(false);

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io("ws://localhost:3000");
      socketRef.current = socket;
      const token = sessionStorage.getItem("token");
      console.log(token);
      socket.emit("joinRoom", { roomId: roomId, token: token  });
      socketRef.current.on("message", async (messageObj) => {
        console.log(messageObj);
        setMessages((messages) => [...messages, messageObj]);
      });
      socket.on("systemMessage" , async (message)=>{
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
      const time = new Date() ;
      const formattedTime = ("0" + time.getHours()).slice(-2) + " : " + ("0"+time.getMinutes()).slice(-2) ;
      socketRef.current.emit("adminMessage", {
        message: messageInput,
        roomId: roomId,
        token: sessionStorage.getItem("token"),
        time : formattedTime ,
      });
      setMessageInput("");
    }
  };
  const handleClose = async () => {
    const token = sessionStorage.getItem('token');
    console.log("Leaving Room");
    socketRef.current.emit("leaveRoom", {"roomId" :roomId , "token" : token});
    setUser(null);
    navigate("/dashboard");
  };
  

  return (
    <>
      {/* <h1>Currently chatting with {user.username}</h1> */}

      <div className="chat-container flex-grow">
        <div className="text-lg">
          
          {messages.map((message, index) => {
             return (
              <div key={index}>
                {message && message?.username && 
                <div>
                  {message.username} : {message.content} {message.time}
                </div>
                }
                {message && message?.username==null &&
                <div>
                  {message.content} 
                </div>
                }
              </div>
          )})}
        </div>
      </div>
      {transfer && <div className="w-50 h-50 border-2 border-gray-100">
            <p className="flex justify-end items-start  "><button className="p-2 text-white  rounded-md bg-red-600"  onClick={closeAdminPanel} >x</button></p>
            <h3 className=" flex justify-center items-center">Admin Transfer Panel</h3>
            {admins.map((admin)=>{
              return (<button key={admin.SID} className={`block ${admin.SID ? 'bg-gray-100' : 'bg-blue-500'}  p-2 m-2 rounded-md`}><div >{admin.username}</div></button>)
            })}
        </div>}
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
          onClick={openAdminPanel}
        >
          Transfer
        </button>
      </div>
    </>
  );
};
export default Chatbox;

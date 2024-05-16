import {useForm} from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

function SingleChat() {
  const jwt = sessionStorage.getItem('token')
    const [messages , setMessages] =  useState([]);
    const [messageInput, setMessageInput] = useState("");
    const formRef = useRef(null);
    const activityRef = useRef(null);
    const socketRef = useRef(null);
    const navigate = useNavigate();
    useEffect(()=>{
      if(!socketRef.current){        
        const socket = io("ws://localhost:3000");
        socketRef.current = socket ;
        socket.emit('createRoom' , sessionStorage.getItem('token'));
        socket.on("message" , async (message)=>{
          setMessages(messages => [...messages , message]);
        });
        

        socket.on("open" , ()=> {
          console.log('WebSocket connection established.');
        });
        socket.on('activity' , (name)=>{
          activityRef.textContent =  `${name} is typing`
        });
      }

    },[]);
    const onSubmit = async(e)=>{
        e.preventDefault();
        if(messageInput.trim()!==""){
          const time = new Date();
          const formattedTime = ("0" + time.getHours()).slice(-2) + " : " + ("0"+time.getMinutes()).slice(-2) ;
          socketRef.current.send({"message" : messageInput , "token" : jwt , "time" : formattedTime});
        }
        setMessageInput("");
    }
    const handleClose = async ()=>{
      console.log("Leaving Room");
      socketRef.current.emit("clientLeaveRoom");
      navigate('/');
    }
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="font-bold text-xl p-2 text-center">Chatbot</h1>
        <div className="bg-white shadow-lg rounded-lg w-96 h-96 flex flex-col p-3">
          <div className="chat-container flex-grow">
          
            {messages.map((message , index)=>{
              return (
                <div key={index}>
                  {message && message.username && 
                  <div>
                    {message.username} : {message.content} {message.time}
                  </div>
                  }
                  {message && message.username==null &&
                  <div>
                    {message.content}
                  </div>
                  }
                </div>
              )
            })}
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
    </>
  );
}

export default SingleChat;

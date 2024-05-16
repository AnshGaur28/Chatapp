import {useForm} from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import io  from 'socket.io-client';
import { useNavigate } from "react-router-dom";

function SingleChat() {
  const jwt = sessionStorage.getItem('token')
    const [messages , setMessages] =  useState([]);
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
        if(e.message){
          const message = await e.message;
          const time = new Date();
        const formattedTime = ("0" + time.getHours()).slice(-2) + " : " + ("0"+time.getMinutes()).slice(-2) ;
          socketRef.current.send({"message" : message , "token" : jwt , "time" : formattedTime});
        }
        formRef.current.reset();
    }
    const handleClose = async ()=>{
      console.log("Leaving Room");
      socketRef.current.emit("clientLeaveRoom");
      navigate('/');
    }
  const {formState: {errors} , register , handleSubmit} = useForm();
  return (
    <>
      <div className="m-2 ">
      <h1 className="font-bold text-xl p-2">Chat Page</h1>
      <div className="messages-container text-lg">
          
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
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="message-form">
        <input
          className="border-2 border-gray-300 "
          type="text"
          {...register('message', { required: true })}
          placeholder="Type your message..."
          
        />
        {errors?.type == "required" && <p>Provide an input</p>}
        <button type="submit" className="border-2 p-2 m-2 bg-blue-500 hover:bg-blue-400 rounded-lg">Send</button>
      </form>
      <p ref={activityRef} className="activity"></p>
    </div>
    <button className="border-2 p-2  bg-red-600 hover:bg-red-400 rounded-lg" onClick={handleClose}>End chat</button>
    </>
  )
}

export default SingleChat ;

import {useForm} from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import io  from 'socket.io-client';

function SingleChat() {
    const [messages , setMessages] =  useState([]);
    const formRef = useRef(null);
    const activityRef = useRef(null);
    const socketRef = useRef(null);
    useEffect(()=>{
      const socket = io("ws://localhost:3000");
      socketRef.current = socket ;
      console.log(socket.id)
      socket.emit('createRoom' , null );
      socket.on("message" , async (message)=>{
        setMessages(messages => [...messages , message]);
      });

      socket.on("open" , ()=> {
        console.log('WebSocket connection established.');
      });
      socket.on('activity' , (name)=>{
        activityRef.textContent =  `${name} is typing`
      })
      return () => {
        socket.off('message');
      };

    },[]);
    const onSubmit = async(e)=>{
        if(e.message){
          const message = await e.message;
          socketRef.current.send({"message" : message});
        }
        formRef.current.reset();
    }
  const {formState: {errors} , register , handleSubmit} = useForm();
  return (
    <>
      <div className="m-2 ">
      <h1 className="font-bold text-xl p-2">Chat Page</h1>
      <div className="messages-container text-lg">
          {messages.map((message , index)=>{
            return (<div key={index}>{message}</div>)
          })}
      </div>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="message-form">
        <input
          className="border-2 border-gray-300 "
          type="text"
          {...register('message', { required: true })}
          placeholder="Type your message..."
          onKeyDown={()=>{socketRef.current.emit('activity' ,  socketRef.current.id.substring(0,5))}}
        />
        {errors?.type == "required" && <p>Provide an input</p>}
        <button type="submit" className="border-2 p-2 m-2 bg-blue-500 hover:bg-blue-400 rounded-lg">Send</button>
      </form>
      <p ref={activityRef} className="activity"></p>
    </div>
    </>
  )
}

export default SingleChat ;

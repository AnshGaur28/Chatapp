import {useForm} from "react-hook-form";
import socket from "../utils/socketClient";
import { useEffect, useRef, useState } from "react";
function SingleChat() {
    const [messages , setMessages] =  useState([]);
    const formRef = useRef(null);
    const activityRef = useRef(null);
    useEffect(()=>{
      socket.on("message" , async (message)=>{
        setMessages(messages => [...messages , message]);
      });

      socket.on("open" , ()=> {
        console.log('WebSocket connection established.');
      });
      socket.on('activity' , (name)=>{
        console.log(name);
        activityRef.textContent =  `${name} is typing`
      })
      return () => {
        socket.off('message');
      };

    },[]);
    const onSubmit = async(e)=>{
        if(e.message){
          const message = await e.message;
          socket.send(message);
        }
        formRef.current.reset();
    }
  const {formState: {errors} , register , handleSubmit} = useForm();
  return (
    <>
      <div>
      <h1>Chat Page</h1>
      <div className="messages-container">
          {messages.map((message , index)=>{
            return (<div key={index}>{message}</div>)
          })}
      </div>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="message-form">
        <input
          type="text"
          {...register('message', { required: true })}
          placeholder="Type your message..."
          onKeyDown={()=>{socket.emit('activity' ,  socket.id.substring(0,5))}}
        />
        {errors?.type == "required" && <p>Provide an input</p>}
        <button type="submit">Send</button>
      </form>
      <p ref={activityRef} className="activity"></p>
    </div>
    </>
  )
}

export default SingleChat ;

/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Chatbox = ({ user, setUser , socket }) => {
  const { SID } = user;
  const roomId = `room_${SID}`;
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [transfer, setTransfer] = useState(false);
  const [admins, setAdmins] = useState([]);

  const openAdminPanel = async () => {
    setInterval(async () => {
      const response = await axios.get("http://localhost:3000/admin/getAdmins");
      setAdmins(response.data.admins);
      // console.log(admins)
    }, 1000);
    setTransfer(true);
  };
  const closeAdminPanel = async () => {
    setTransfer(false);
  };

  // const socketSetUpOnce = useRef(false);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = socket;
      const token = sessionStorage.getItem("token");
      console.log(socket)
      console.log(token);
      socket.emit("joinRoom", { roomId: roomId, token: token });
      socketRef.current.on("message", async (messageObj) => {
        console.log(messageObj);
        setMessages((messages) => [...messages, messageObj]);
      });
      
      const getMessageHistory = async () => {
        const response = await axios.get(
          "http://localhost:3000/admin/getRoomHistory",
          { params: { roomId: roomId } }
        );
        console.log(
          "Admin chat panel",
          response.data.historyMessages,
          response.data.username,
          response.data
        );

        setMessages((messages) => [
          ...messages,
          ...response.data.historyMessages,
        ]);
      };
      getMessageHistory();
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

      socketRef.current.emit("adminMessage", {
        message: messageInput,
        roomId: roomId,
        token: sessionStorage.getItem("token"),
        time: formattedTime,
      });

      setMessageInput("");
    }
  };

  const handleClose = async () => {
    const token = sessionStorage.getItem("token");
    console.log("Leaving Room");
    socketRef.current.emit("leaveRoom", { roomId: roomId, token: token });
    setUser(null);
    navigate("/dashboard");
  };
  const handleTransfer = async(adminSID)=>{
    const token = sessionStorage.getItem('token');
    console.log("inside handle Transfer" , roomId , adminSID)
    socketRef.current.emit("leaveRoom" , { roomId: roomId, token: token });
    socketRef.current.emit("transferRequest" , {roomId, adminSID});
    setUser(null);
    window.location.reload();
  }

  return (
    <>
      {/* <h1>Currently chatting with {user.username}</h1> */}

      <div className="chat-container flex-grow ">
        <div className="text-lg">
          {messages.map((message, index) => {
            return (
              <div key={index}>
                {message && message?.username && (
                  <div className="my-4 ">
                    <div
                      className={`flex ${
                        sessionStorage.getItem("username") ==
                          message.username || message.role == "admin"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <span
                        className={`${
                          sessionStorage.getItem("username") ==
                            message.username || message.role == "admin"
                            ? " row bg-[#778da9] text-white "
                            : " justify-end bg-[#e0e1dd] text-black "
                        } text-black  rounded-md p-2 `}
                      >
                        {/* {message.username} : {message.content} */}
                        {message.content}
                        <span className={`${
                          sessionStorage.getItem("username") ==
                            message.username || message.role == "admin" ? "text-white" : "text-black"} text-xs ml-5 `}>
                          {message.time}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
                {message && message?.username == null && (
                  <div>{message.content}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {transfer && (
        <div className="flex flex-row w-full h-50 justify-end">
          <div className="flex flex-col mb-2 border-2 border-gray-100 w-56 bg-white">
            <p className="flex justify-end items-start  ">
              <button
                className=" text-white w-7 h-7 overflow-hidden  rounded-sm bg-red-600"
                onClick={closeAdminPanel}
              >
                x
              </button>
            </p>
            <h3 className=" flex justify-center items-center">
              Admin Transfer Panel
            </h3>
            {admins.map((admin) => {
              return (
                <button
                  key={admin.SID}
                  className={`block text-gray-500 ${
                    admin.SID && !admin.closed
                      ? "bg-blue-400 text-white hover:bg-blue-500"
                      : "bg-gray-300"
                  }  p-2 m-2 rounded-md`}
                  disabled={!admin.SID || admin.closed}
                  onClick={() => {
                    handleTransfer(admin.SID);
                  }}
                >
                  <div>
                    {admin.username}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-row h-10 ">
        <form
          action=""
          className="flex flex-row h-10 w-full"
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
            className="text-white mx-4 rounded-lg ml-2 "
            onClick={onSubmit}
          >
            <img src="send.png" className="h-[30px] w-[30px] "/>
          </button>
        </form>
        <button
          className=" text-white mx-4 rounded-lg ml-2"
          onClick={handleClose}
        >
          <img src="/logout.png" className="h-[30px] w-[30px] "/>
        </button>
        <button
          className=" text-white mx-4  rounded-lg ml-2"
          onClick={openAdminPanel}
        >
            <img src="transfer.png" className="h-[30px] w-[30px] "/>
        </button>
      </div>
    </>
  );
};
export default Chatbox;

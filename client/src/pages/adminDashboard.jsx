/* eslint-disable react/jsx-key */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Chatbox from "../Components/Chat/Chatbox";
import { io } from "socket.io-client";
export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState(null);
  const adminUsername = sessionStorage.getItem("username");

  const handleUserClick = (user) => {
    console.log(user);
    setSelectedUser(user);
  };

  const setUser = async (user) => {
    setSelectedUser(user);
  };

  // const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const socketRef = useRef(null); 
  // const handleSubmit = async (SID) => {
  //   navigate(`/adminChatPanel/room_${SID}`);
  // };
  useEffect(() => {
    if (!socketRef.current) {
      const socket = io("ws://localhost:3000");
      socketRef.current = socket;
      const username = sessionStorage.getItem('username');
      socket.emit('updateAdmin' , username);
      console.log(socket);
    }
    const getClients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/admin/queueList"
        );
        setUsers(response.data.clients);
      } catch (error) {
        console.log(error.message);
      }
    };
    getClients();
    setInterval(() => {
      getClients();
    }, 3000);
    socketRef.current.on('transferRequest' , async (roomId)=>{
      console.log("viruj admin" , roomId)
      socketRef.current.emit("joinRoom", { roomId: roomId, token: token });  
      const userSID = roomId.slice(5);
      console.log(userSID);
      const response = await axios.get("http://localhost:3000/admin/getClientWithSID" , {params : { SID : userSID}});
      console.log(response.data);
      setSelectedUser(response.data);
    });
    //  Find clients in queue from the data store and display on the screen
    

    
  }, [socketRef.current]);

  return (
    <>
      <div className="bg-gray-300 h-screen flex flex-col">
        <Navbar username={adminUsername} />
        <div className="flex-grow flex ">
          <div className="w-1/4 m-4 px-2 bg-white rounded-lg shadow-lg text-center ">
            <h1 className="text-xl text-blue-900 mt-2 mb-4">Clients</h1>
            {users.map((user) => (
              <button
                className={`block w-full px-2 py-2  ${
                  user.closed === false
                    ? "bg-[#415a77] text-white shadow-gray-300  hover:bg-[#1b263b]"
                    : "bg-gray-300"
                } my-2  text-gray-700 rounded-full`}
                disabled={user.closed}
                key={user.SID}
                onClick={() => handleUserClick(user)}
              >
                <div>{user.username}</div>
              </button>
            ))}
          </div>
          <div
            // style={{
            //   backgroundImage: "url('/08.jpg')", // Adjust the path as needed
            //   backgroundSize: "cover",
            //   backgroundPosition: "center",

            // }}
            className="w-3/4 m-4 bg-white shadow-lg p-4 flex flex-col rounded-lg"
          >
            {selectedUser ? (
              <Chatbox
                user={selectedUser}
                setUser={setUser}
                socket={socketRef.current}
              />
            ) : (
              <h1 className="text-3xl text-gray-400">
                Click on a user to start Chatting
              </h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* eslint-disable react/jsx-key */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Chatbox from "../Components/Chat/Chatbox";
import { io } from "socket.io-client";
export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState(null);

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
      <div className="bg-white h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex ">
          <div className="w-1/4 m-4 px-2 bg-[#5155c2] rounded-lg shadow-lg text-center " >
            <h1 className="text-xl text-white mt-2 mb-4">Clients</h1>
            {users.map((user) => (
              <button
                className={`block w-full px-2 py-2  ${
                  user.closed === false
                    ? "bg-white shadow-xl shadow-gray-300  hover:bg-gray-200"
                    : "bg-gray-100"
                } my-2  text-gray-700`}
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
            className="w-3/4 m-4 bg-[#EFEFEF] shadow-lg p-4 flex flex-col rounded-lg"
          >
            {selectedUser ? (
              <Chatbox user={selectedUser} setUser={setUser} socket={socketRef.current} />
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

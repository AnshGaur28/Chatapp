/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Chatbox from "../Components/Chat/Chatbox";
export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const setUser = async (user) => {
    setSelectedUser(user);
  };

  // const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  // const handleSubmit = async (SID) => {
  //   navigate(`/adminChatPanel/room_${SID}`);
  // };
  useEffect(() => {
    //  Find clients in queue from the data store and display on the screen
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
  }, []);

  return (
    <>
      <div className="bg-gray-50 h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex">
          <div className="w-1/4 m-4 px-2 bg-white rounded-lg shadow-lg text-center">
            <h1 className="text-xl mt-2 mb-4">Clients</h1>
            {users.map((user) => (
              <button
                className={`block w-full px-2 py-2 ${
                  user.closed === false
                    ? "bg-blue-500 hover:bg-blue-400 "
                    : "bg-gray-300"
                } my-2 rounded-lg text-white`}
                disabled={user.closed}
                key={user.SID}
                onClick={() => handleUserClick(user)}
              >
                <div>{user.username}</div>
              </button>
            ))}
          </div>
          <div className="w-3/4 m-4 bg-white rounded-lg shadow-lg p-4 flex flex-col">
            {selectedUser ? (
              <Chatbox user={selectedUser} setUser={setUser} />
            ) : (
              <h1 className="text-3xl">Click on a user to start Chatting</h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

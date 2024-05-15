/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const handleSubmit = async (SID) => {
    navigate(`/adminChatPanel/room_${SID}`);
  };
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
                onClick={() => handleSubmit(user.SID)}
              >
                <div>{user.username}</div>
              </button>
            ))}
          </div>
          <div className="w-3/4 m-4 bg-white rounded-lg shadow-lg p-4 flex flex-col">
            <h1 className="text-xl">Chatbox</h1>
            <div className="chat-container flex-grow"></div>

            <div className="flex flex-row">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

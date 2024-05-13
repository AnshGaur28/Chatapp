/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react"
import axios from 'axios'
import {useNavigate} from 'react-router-dom';
export default function AdminDashboard(){
    const navigate = useNavigate();
    const [users , setUsers] = useState([]);
    const handleSubmit = async(SID)=>{
        
        navigate(`/adminChatPanel/room_${SID}`);
    }
    useEffect(()=>{
        //  Find clients in queue from the data store and display on the screen
        const getClients = async ()=>{
            try{
                const response = await axios.get('http://localhost:3000/admin/queueList');
                setUsers(response.data.clients);
            }
            catch(error){
                console.log(error.message)
            }
        }
        getClients();

        setInterval(()=>{
            getClients();
        },10000)

    }, []);
    return (
        <>
            <div className="font-bold text-xl p-2 flex justify-center items-center">Dashboard</div>
            <div className=" flex justify-center flex-row m-2 p-2 ">
                {
                    users.map((user)=>{
                        return (
                            <button className={`p-2 ${user.closed==false? 'bg-blue-500' : 'bg-gray-300'} hover:bg-blue-400 m-2 rounded-lg`} key={user.SID} onClick={() => handleSubmit(user.SID)} ><div>{user.username}</div></button>
                        )
                    })
                }
            </div>
        </>
    )
}
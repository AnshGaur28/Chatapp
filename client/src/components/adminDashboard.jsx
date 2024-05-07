import { useEffect, useState } from "react"
import axios from 'axios'
export default function AdminDashboard(){
    const [users , setUsers] = useState([]);

    useEffect(()=>{
        //  Find clients in queue from the data store and display on the screen
        const getClients = async ()=>{
            try{
            const response = await axios.get('http://localhost:3000/admin/queueList');
            setUsers(users => [...users , response.data]);
            }
            catch(error){
                console.log(error.message)
            }
        }

        getClients();

    }, []);
    return (
        <>
            <div>Dashboard</div>
            {users.map((user , index)=>{
                <div>{index} : {user}</div>
            })}
        </>
    )
}
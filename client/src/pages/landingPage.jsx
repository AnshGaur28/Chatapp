import {useNavigate} from 'react-router-dom';
export default function LandingPage(){
    const navigate = useNavigate()
    return (
        <div className='h-screen '>
            <div className='text-4xl font-semibold text-gray-600 italic flex justify-center items-center'>Chat Application</div>
            {sessionStorage.getItem('token') && <div className='flex justify-center  text-lg' ><button className='bg-green-600  rounded-lg hover:bg-green-400 p-2 m-2' onClick={()=>{navigate('/singleChat')}}>Ask a query</button></div> }
            {sessionStorage.getItem('token')==null && <div className='flex justify-center  text-lg' ><button className='bg-green-600  rounded-lg hover:bg-green-400 p-2 m-2' onClick={()=>{navigate('/Login')}}>Login</button></div> }
            
        </div>
    )
}
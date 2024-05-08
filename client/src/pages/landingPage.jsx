import {useNavigate} from 'react-router-dom';
export default function LandingPage(){
    const navigate = useNavigate()
    return (
        <div>
            <div className='text-3xl font-semibold flex justify-center items-center'>Chat Application</div>
            <div className='flex justify-center items-center text-lg' ><button className='bg-blue-500  rounded-lg hover:bg-blue-400 p-2 m-2' onClick={()=>{navigate('/singleChat')}}>Ask a query</button></div>
        </div>
    )
}
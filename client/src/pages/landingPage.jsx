import {useNavigate} from 'react-router-dom';
export default function LandingPage(){
    const navigate = useNavigate()
    return (
        <div className='h-screen flex flex-col justify-center items-center '>
            <div className='text-6xl p-10 font-bold flex flex-col text-gray-600 italic item-start justify-center'>Customer Support</div>
            { 
            <div className='flex justify-center items-center  text-lg' >
                <div className='w-1/2 flex flex-col justify-center items-center mr-20'>
                    <img src='/office-man.png' className='cover object-center overflow-hidden w-[200px] h-[200px]'/>
                    <button className='bg-[#5050BC]  rounded-xl hover:bg-[#709FF4]  p-3 m-2 w-[200px] text-white' onClick={()=>{navigate('/Login')}}>Admin</button>

                </div>
                <div className='w-1/2 flex flex-col justify-center items-center'>
                    <img src='/team.png' className='cover object-center overflow-hidden w-[200px] h-[200px]'/>
                    <button className='bg-[#709FF4] rounded-xl hover:bg-[#5050BC] p-3 m-2 w-[200px] text-white' onClick={()=>{navigate('/clientLogin')}}>Client</button>
                </div>
            </div> }
            
        </div>
    )
}
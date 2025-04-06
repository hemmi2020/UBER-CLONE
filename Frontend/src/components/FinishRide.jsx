import React from 'react'
import { Link } from 'react-router-dom'

const FinishRide = (props) => {
  return (
    <div>
      <h5 className="p-1 text-center absolute w-[93%] top-0 " onClick={()=>{
        props.setFinishRidePanel(false)
        }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
        <h3 className="text-2xl font-semibold mb-5">Finish this Ride!</h3>
        <div className='flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-3'>
            <div className='flex items-center gap-3 '>
                <img className='h-10 w-10 object-cover rounded-full' src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww" alt="" />
                <h2 className='text-lg font-medium'>Hamza Khan</h2>
            </div>
            <h5 className='text-lg font-semibold'>7 Km</h5>
        </div>
        <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full mt-5'>
        <div className='flex items-center gap-5 p-2 border-gray-300 border-b-2'>
          <i className="text-lg ri-map-pin-2-line"></i>
          <div>
            <h3 className='text-lg font-medium'>562/11-A</h3>
            <p className='text-sm -mt-1 text-gray-600'>gulshan-e-anila, karachi</p>
          </div>
          </div>
        <div className='flex items-center gap-5 p-2 border-gray-300 border-b-2'>
        <i className="text-lg ri-map-pin-2-line"></i>
          <div>
            <h3 className='text-lg font-medium'>562/11-A</h3>
            <p className='text-sm -mt-1 text-gray-600'>gulshan-e-anila, karachi</p>
          </div>
        </div>
        <div className='flex items-center gap-5 p-2 border-gray-300 '>
        <i className="ri-currency-line"></i>
          <div>
            <h3 className='text-lg font-medium'>Rs.240</h3>
            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
          </div>
        </div>
        </div>
        <form ></form>
        <div className='mt-10 w-full'>
        
        <Link to='/captain-home' className='w-full mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg flex items-center text-lg justify-center'>
          Finish Ride
        </Link>
        
        <p className=' mt-6 text-xs'>click on finish ride button if you have completed the payment</p>
        </div>
        </div>
    </div>
  )
}

export default FinishRide

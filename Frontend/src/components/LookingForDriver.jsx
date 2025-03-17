import React from 'react'

const LookingForDriver = () => {
  return (
    <div>
     <h5 className="p-1 text-center absolute w-[93%] top-0 " onClick={()=>{
          props.setConfirmRidePanel(false)
        }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
        <h3 className="text-2xl font-semibold mb-5">Looking For Driver</h3>
        <div className='flex gap-2 justify-between flex-col items-center'>
        <img className='h-20' src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" />
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
        
        </div>
    </div>
  )
}

export default LookingForDriver

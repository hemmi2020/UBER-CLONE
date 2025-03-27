import React from "react";
import { Link } from "react-router-dom";

const Riding = () => {
  return (
    <div className="h-screen">
      <Link to='/home' className="fixed  right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full">
      <i className=" text-lg font-bold  ri-home-4-line"></i>
      </Link>
      <div className="h-1/2">
        <img className="h-full w-full object-cover"
          src="https://blogadmin.uberinternal.com/wp-content/uploads/2018/11/Swedensv-se_Shield-Web_RiderEmergencyAssistance_20181012.gif"
          alt=""
        />
      </div>
      <div className="h-1/2 p-4">
      <div className='flex items-center justify-between'>
        <img className='h-12' src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" />
        <div className='text-right'>
            <h2 className='text-lg font-medium'>maaz</h2>
            <h4 className='text-xl font-semibold -mt-1 -mb-1'>MP03 AB 1234</h4>
            <p className='text-sm text-gray-600'>Toyota Yaris</p>

        </div>
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
        <div className='flex items-center gap-5 p-2 border-gray-300 '>
        <i className="ri-currency-line"></i>
          <div>
            <h3 className='text-lg font-medium'>Rs.240</h3>
            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
          </div>
        </div>
        </div>
        
        </div>
        <button className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg">Make a payment</button>
      </div>
    </div>
  );
};

export default Riding;

import React,{useState, useRef} from "react";
import { Link } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useGSAP} from '@gsap/react';
import gsap from 'gsap';


const CaptainRiding = () => {

  const [finishRidePanel, setFinishRidePanel] = useState(false)
  const finishRidePanelRef = useRef(null)

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0%)",
          duration: 0.5,
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
        });
      }
    },
    [finishRidePanel]
  );
  return (
    <div className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-16 absolute top-5 left-5"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to=""
          className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className=" text-lg font-medium ri-logout-box-line"></i>
        </Link>
      </div>
      <div className="h-4/5">
        <img
          className="h-full w-full object-cover"
          src="https://blogadmin.uberinternal.com/wp-content/uploads/2018/11/Swedensv-se_Shield-Web_RiderEmergencyAssistance_20181012.gif"
          alt=""
        />
      </div>
      <div className="h-1/5 p-6 flex items-center relative justify-between bg-yellow-400"
      onClick={()=>{
        setFinishRidePanel(true);
      }}
      >
        <h5
          className="p-1 text-center absolute w-[93%] top-0 "
          onClick={() => {}}
        >
          <i className="text-3xl text-black ri-arrow-up-wide-line"></i>
        </h5>
        <h4 className="text-xl font-semibold">4 Km away</h4>
        <button className=" mt-1 bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Complete Ride
        </button>
      </div>
      <div ref={finishRidePanelRef} className="fixed w-full z-10 bottom-0  bg-white translate-y-full px-3 py-10 pt-12" >
        <FinishRide setFinishRidePanel={setFinishRidePanel}  />
      </div>
    </div>
  );
};

export default CaptainRiding;

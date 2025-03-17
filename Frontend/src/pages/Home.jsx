import React, { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmedRide from "../components/ConfirmedRide";
import LookingForDriver from "../components/LookingForDriver";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
  };
  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          // opacity: 1,
          // padding: 20,
          duration: 0.5,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: 0,
          duration: 0.5,
          // padding: 20,
          // opacity: 0,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );
  useGSAP(
    function () {
      if (vehiclePanelOpen) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0%)",
          duration: 0.5,
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
        });
      }
    },
    [vehiclePanelOpen]
  );
  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0%)",
          duration: 0.5,
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
        });
      }
    },
    [confirmRidePanel]
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden"> 
      <img
        className="w-16 absolute top-5 left-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      <div className="h-screen w-screen ">
        <img
          src="https://blogadmin.uberinternal.com/wp-content/uploads/2018/11/Swedensv-se_Shield-Web_RiderEmergencyAssistance_20181012.gif"
          alt=""
        />
      </div>
      <div className=" flex flex-col justify-end h-screen absolute top-0 w-full ">
        <div className="h-[30%] p-6 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 top-3 right-5 text-gray-500 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl  font-semibold">Find a trip</h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-20 w-1 top-[52%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => setPanelOpen(true)}
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full "
              type="text"
              name=""
              id=""
              placeholder="Add a pickup location"
            />
            <input
              onClick={() => setPanelOpen(true)}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg mt-3 w-full"
              type="text"
              name=""
              id=""
              placeholder="Add a destination location"
            />
          </form>
          {/* <button
                        className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                        Find Trip
                    </button> */}
        </div>
        <div ref={panelRef} className=" bg-white h-0">
          <LocationSearchPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanelOpen={setVehiclePanelOpen}
          />
        </div>
      </div>
      <div ref={vehiclePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full  bg-white px-3 py-10 pt-12">
        <VehiclePanel setConfirmRidePanel={setConfirmRidePanel} setVehiclePanelOpen={setVehiclePanelOpen} />
      </div>
      <div ref={confirmRidePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full  bg-white px-3 py-8 pt-12">
        <ConfirmedRide setConfirmRidePanel={setConfirmRidePanel}/>
      </div> 
      <div className="fixed w-full z-10 bottom-0 translate-y-full  bg-white px-3 py-8 pt-12">
        <LookingForDriver />
      </div>
    </div>
  );
};

export default Home;

import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import SocketProvider, { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainHomeContent = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);
  const [ride, setRide] = useState(null); // State to hold ride data

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    console.log("Socket connected:", socket.connected);
    socket.on('connect', () => {
      console.log("Socket connected with ID:", socket.id);
    });
  }, [socket]);

  useEffect(() => {
    if (captain && captain._id) {
      console.log("Captain ID for socket connection:", captain._id);
      
      // Verify socket is joining with correct data
      socket.emit('join', {
        userId: captain._id,
        userType: 'captain'
      });
      
      // Log when socket connects/disconnects
      socket.on('connect', () => {
        console.log("Socket connected with ID:", socket.id);
      });
      
      socket.on('disconnect', () => {
        console.log("Socket disconnected");
      });
    }
  }, [captain, socket]);

  useEffect(() => {
    // Listen for new ride requests
    socket.on('new-ride', (data) => {
      console.log('Raw new ride event data:', data);
      
      // Make sure we're handling the data structure correctly
      const rideData = data;
      
      // Set the ride state with the received data
      setRide(rideData);
      setRidePopUpPanel(true);
      
      // Log the structure to debug
      console.log('Ride state set to:', rideData);
    });
  
    return () => {
      socket.off('new-ride');
    };
  }, [socket]);

  async function confirmRide() {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/rides/confirm`, {
      // You may need to send rideId or other data here
    });
    setRidePopUpPanel(false);
    setConfirmRidePopUpPanel(true);
  }

  useGSAP(
    function () {
      if (ridePopUpPanel) {
        gsap.to(ridePopUpPanelRef.current, {
          transform: "translateY(0%)",
          duration: 0.5,
        });
      } else {
        gsap.to(ridePopUpPanelRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
        });
      }
    },
    [ridePopUpPanel]
  );

  useGSAP(
    function () {
      if (confirmRidePopUpPanel) {
        gsap.to(confirmRidePopUpPanelRef.current, {
          transform: "translateY(0%)",
          duration: 0.5,
        });
      } else {
        gsap.to(confirmRidePopUpPanelRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
        });
      }
    },
    [confirmRidePopUpPanel]
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
      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://blogadmin.uberinternal.com/wp-content/uploads/2018/11/Swedensv-se_Shield-Web_RiderEmergencyAssistance_20181012.gif"
          alt=""
        />
      </div>
      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>
      <div ref={ridePopUpPanelRef} className="fixed w-full z-10 bottom-0  bg-white translate-y-full px-3 py-10 pt-12" >
        <RidePopUp ride={ride} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} setRidePopUpPanel={setRidePopUpPanel} confirmRide={confirmRide} />
      </div>
      <div ref={confirmRidePopUpPanelRef} className="fixed h-screen w-full z-10 bottom-0  bg-white translate-y-full px-3 py-10 pt-12" >
        <ConfirmRidePopUp setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} setRidePopUpPanel={setRidePopUpPanel}  />
      </div>
    </div>
  );
};

const CaptainHome = () => {
  const { captain } = React.useContext(CaptainDataContext);

  if (!captain || !captain._id) {
    return <div>Loading...</div>;
  }

  return (
    <SocketProvider userId={captain._id} userType="captain">
      <CaptainHomeContent />
    </SocketProvider>
  );
};

export default CaptainHome;

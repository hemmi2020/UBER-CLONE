import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { CaptainDataContext } from "../context/CaptainContext";
import { useContext } from "react";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();
  const {captain, setCaptain } = useContext(CaptainDataContext);
 

  const submitHandler =async (e) => {
    e.preventDefault();
   const captain = { 
    email: email, 
    password: password 
  };
  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain);
  if(response.status === 200){
    setCaptain(response.data);
    localStorage.setItem("token", response.data.token);
    Navigate("/captain-home");
  }

    setEmail("");
    setPassword("");
  };
  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <img
            className="w-16 ml-1 mt-1 mb-1"
            src="https://www.svgrepo.com/show/505031/uber-driver.svg"
            alt=""
          />
          <h3 className="text-lg font-medium mb-2">What's your email?</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-[#eeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="Enter Your Email"
          />
          <h3 className="text-lg font-medium mb-2">Enter Your Password</h3>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-[#eeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="password"
            placeholder="Enter Your Password"
          />
          <button className="bg-[#111] font-semibold text-white mb-7 rounded px-4 py-2  w-full text-lg placeholder:text-base">
            Login
          </button>
        </form>
        <p className="text-center">
          want to be a captain?
          <Link to="/captain-signup" className="text-blue-600">
            Register here
          </Link>
        </p>
      </div>
      <div>
        <Link
          to="/login"
          className="bg-[#d5622d] flex items-center justify-center font-semibold text-white mb-7 rounded px-4 py-2  w-full text-lg placeholder:text-base"
        >
          Sign in as a User
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;

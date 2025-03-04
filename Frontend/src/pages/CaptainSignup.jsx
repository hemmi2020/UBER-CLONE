import React,{useState} from 'react'
import { Link } from 'react-router-dom'

const CaptainSignup = () => {
    const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [firstName, setFirstName] = useState("");
      const [lastName, setLastName] = useState("");
      const [userData, setUserData] = useState({});
    
      const submitHandler = (e) => {
        e.preventDefault();
        setUserData({
          email: email,
          password: password,
          fullName:{firstName: firstName,
          lastName: lastName,}
        });
        
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
      };
  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
      <img
            className="w-16 ml-1 mt-1 mb-1"
            src="https://www.svgrepo.com/show/505031/uber-driver.svg"
            alt=""
          />
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-medium mb-2">What's your Name</h3>
          <div className=" flex gap-3 mb-5">
            <input
              required
              className="bg-[#eeeee]  w-1/2 rounded px-4 py-2 border  text-lg placeholder:text-base"
              type="text"
              placeholder=" First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <input
              required
              className="bg-[#eeeee] w-1/2  rounded px-4 py-2 border  text-lg placeholder:text-base"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>
          <h3 className="text-lg font-medium mb-2">What's your email?</h3>
          <input
            required
            className="bg-[#eeeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <h3 className="text-lg font-medium mb-2">Enter Your Password</h3>
          <input
            className="bg-[#eeeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button className="bg-[#111] font-semibold text-white mb-5 rounded px-4 py-2  w-full text-lg placeholder:text-base">
            Login
          </button>
        </form>
        <p className="text-center">
          Already have an account?
          <Link to="/captain-login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
      <div>
        <p className="text-[10px] leading-tight ">
          This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply.</span>
        </p>
      </div>
    </div>
  )
}

export default CaptainSignup

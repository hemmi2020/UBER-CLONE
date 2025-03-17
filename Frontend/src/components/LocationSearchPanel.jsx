import React from "react";

const LocationSearchPanel = (props) => {

  const locations = [
    'BS53, near biryani chowk, gulshan-e-anila',
    'BS52, near mukka chowk, adeel terrace',
    'BS54, near bhaijaan chowk, gulshan-e-anila',
    'BS55, near waterpump , yousuf plaza'
  ]

  return (

    <div className="m-2"> 
     {
      locations.map(function(elem, index){
        return <div key={index} onClick={()=>{
          props.setVehiclePanelOpen(true);
          props.setPanelOpen(false)
        }} className="flex border-2 border-gray-100 active:border-black p-3 rounded-xl items-center justify-start gap-2 mb-2">
        <h2 className="bg-[#eee] p-2 rounded-sm">
          <i className="ri-map-pin-fill"></i>
        </h2>
        <h4 className=" font-medium"> 
          {elem}
        </h4>
      </div>
      })
     } 
      
    </div>
  )
};

export default LocationSearchPanel;

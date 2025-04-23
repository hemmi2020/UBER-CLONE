import { useState, useEffect } from "react";
import axios from "axios";

const LocationSearchPanel = ({
  setPanelOpen,
  setVehiclePanelOpen,
  searchInput,
  setPickup,
  setDestination,
  isPickup,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput?.length > 2) {
        setIsLoading(true);
        try {
          const token = localStorage.getItem("authToken");
          
          
          if (!token) {
            setError("No authentication token found. Please login again.");
            setIsLoading(false);
            return;
          }

          const response = await axios.get(
            `${
              import.meta.env.VITE_BASE_URL
            }/maps/get-suggestions?input=${encodeURIComponent(searchInput)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              },
            }
          );
          
          // Debug the response
          // console.log("API Response:", response.data);
          // setDebugInfo(JSON.stringify(response.data, null, 2));
          
          // Check if suggestions exist in the response
          if (response.data && Array.isArray(response.data.suggestions)) {
            setSuggestions(response.data.suggestions);
          } else if (response.data && Array.isArray(response.data)) {
            // If the response is directly an array
            setSuggestions(response.data);
          } else {
            // If the response has a different structure
            setError("Unexpected response format from server");
            console.error("Unexpected response format:", response.data);
          }
          
          setError(null);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
          
          if (error.response) {
            console.log("Error response data:", error.response.data);
            console.log("Error response status:", error.response.status);
            setDebugInfo(JSON.stringify(error.response.data, null, 2));
            
            if (error.response.status === 401) {
              setError("Authentication failed. Please login again.");
            } else {
              setError(`Error (${error.response.status}): ${error.response.data.message || "Unknown error"}`);
            }
          } else {
            setError("Network error or server not responding");
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setDebugInfo(null);
      }
    };

    fetchSuggestions();
  }, [searchInput]);

  const handleLocationSelect = (location) => {
    if (isPickup) {
      setPickup(location);
    } else {
      setDestination(location);
    }
    // setPanelOpen(false);
    // setVehiclePanelOpen(true);
  };

  return (
    <div className="m-2">
      {error && (
        <div className="text-red-500 p-2 mb-2 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
      
      {isLoading && searchInput?.length > 2 ? (
        <div className="p-3 text-gray-500">Loading suggestions...</div>
      ) : suggestions.length > 0 ? (
        suggestions.map((location, index) => (
          <div
            key={index}
            onClick={() => handleLocationSelect(location)}
            className="flex border-2 border-gray-100 active:border-black p-3 rounded-xl items-center justify-start gap-2 mb-2"
          >
            <h2 className="bg-[#eee] p-2 rounded-sm">
              <i className="ri-map-pin-fill"></i>
            </h2>
            <h4 className="font-medium">{location}</h4>
          </div>
        ))
      ) : (
        searchInput?.length > 2 && !isLoading && !error && (
          <div className="p-3 text-gray-500">No suggestions found</div>
        )
      )}
      
      {/* Debug info - remove in production */}
      {debugInfo && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
          <pre>{debugInfo}</pre>
        </div>
      )}
    </div>
  );
};

export default LocationSearchPanel;
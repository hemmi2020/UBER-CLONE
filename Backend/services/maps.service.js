const axios = require("axios");
const captainModel = require("../models/captain.model");

const getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error(`Unable to fetch coordinates: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        throw new Error(`Geocoding failed: ${error.message}`);
    }
};

// Export the function
module.exports.getAddressCoordinate = getAddressCoordinate;

// Calculate distance using Haversine formula
const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

// Estimate time based on distance
const estimateTime = (distanceKm) => {
    const avgSpeedKmh = 30; // Adjust based on your needs
    const timeHours = distanceKm / avgSpeedKmh;
    const timeMinutes = timeHours * 60;
    
    if (timeMinutes < 60) {
        return `${Math.round(timeMinutes)} mins`;
    } else {
        const hours = Math.floor(timeHours);
        const mins = Math.round((timeHours - hours) * 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ${mins} mins`;
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }
    
    try {
        // Use the function directly, not through 'this'
        const originCoords = await getAddressCoordinate(origin);
        const destCoords = await getAddressCoordinate(destination);
        
        // Calculate distance using Haversine formula
        const distanceKm = calculateDistance(
            originCoords.lng, 
            originCoords.ltd, 
            destCoords.lng, 
            destCoords.ltd
        );
        
        // Convert to meters for consistency with Google Maps API format
        const distanceMeters = distanceKm * 1000;
        
        // Calculate duration in seconds (for consistency with Google Maps API format)
        const avgSpeedKmh = 30;
        const timeHours = distanceKm / avgSpeedKmh;
        const timeSeconds = timeHours * 3600;
        
        // Format for display
        const distanceText = distanceKm < 1 
            ? `${Math.round(distanceKm * 1000)} m` 
            : `${distanceKm.toFixed(1)} km`;
            
        const durationText = estimateTime(distanceKm);
        
        // Return in a format compatible with your fare calculation
        return {
            distance: {
                text: distanceText,
                value: distanceMeters
            },
            duration: {
                text: durationText,
                value: timeSeconds
            }
        };
    } catch (error) {
        console.error('Distance calculation error:', error);
        throw new Error(`Failed to calculate distance: ${error.message}`);
    }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description);
        } else {
            throw new Error(`Unable to fetch suggestions: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Autocomplete error:', error);
        throw new Error(`Autocomplete failed: ${error.message}`);
    } 
};

module.exports.getCaptainInTheRadius = async (lng, ltd, radius) => {
    console.log(`Searching for captains at [${lng}, ${ltd}] with radius ${radius}km`);
    
    try {
        // First check if we have any active captains
        const activeCaptains = await captainModel.find({ status: "active" });
        console.log(`Total active captains: ${activeCaptains.length}`);
        
        // Check if any captains have geoLocation
        const captainsWithGeo = await captainModel.find({ 
            "geoLocation.coordinates": { $exists: true },
            status: "active"
        });
        console.log(`Captains with geoLocation: ${captainsWithGeo.length}`);
        
        // Now try the geospatial query
        const captainsInRadius = await captainModel.find({
            geoLocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, ltd] // longitude first, then latitude
                    },
                    $maxDistance: radius * 1000 // convert km to meters
                }
            },
            status: "active" // Only find active captains
        });
        
        console.log(`Found ${captainsInRadius.length} captains in radius`);
        return captainsInRadius;
    } catch (error) {
        console.error("Error in getCaptainInTheRadius:", error);
        // Return empty array instead of throwing to avoid breaking the flow
        return [];
    }
};
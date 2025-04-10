const axios = require("axios");

module.exports.getAddressCoordinate = async (address) => {
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
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

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
        // Get coordinates for origin and destination
        const originCoords = await this.getAddressCoordinate(origin);
        const destCoords = await this.getAddressCoordinate(destination);
        
        // Calculate distance using Haversine formula
        const distanceKm = calculateDistance(
            originCoords.ltd, 
            originCoords.lng, 
            destCoords.ltd, 
            destCoords.lng
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
        console.error(error);
        throw error;
    }
}

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
            throw new Error('Unable to fetch suggestions');
        }
    }catch (error) {
        console.error(error);
        throw error;
    } 
}
const mapService = require('../services/maps.service');
const {validationResult} = require('express-validator');
require ('dotenv').config();
const {query} = require('express-validator');



module.exports.getCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    
    const { address } = req.query;
    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch coordinates' });
    }
}

module.exports.getDistanceTime = async (req, res) => {

    try {
        const { origin, destination } = req.query;
        const distanceTime = await mapService.getDistanceTime(origin, destination);
        res.status(200).json(distanceTime);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch distance and time' });
    }
    }


module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { input } = req.query;
        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        res.status(200).json(suggestions);
        
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch suggestions' });
    }
}

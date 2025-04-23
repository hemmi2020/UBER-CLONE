const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId, verifyActiveCaptains } = require('../socket');
const rideModel = require('../models/ride.model');  
const captainModel = require('../models/captain.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {  pickup , destination, vehicleType } = req.body;

    try{
        const ride = await rideService.createRide({user: req.user._id , pickup, destination, vehicleType});

        console.log("Ride created:", ride); 

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup); 
        console.log("Pickup coordinates:", pickupCoordinates);

        const captainsInRadius = await mapService.getCaptainInTheRadius(
            pickupCoordinates.ltd, 
            pickupCoordinates.lng, 
            10
        );
        console.log("Captains in radius:", captainsInRadius);

        const allActiveCaptains = await verifyActiveCaptains();
console.log(`Total verified active captains: ${allActiveCaptains.length}`);

        ride.otp = ""

        const rideWithUser = await rideModel.findOne({_id: ride._id }).populate('user');
        console.log("Ride with user (full object):", JSON.stringify(rideWithUser, null, 2));  

        await Promise.all(captainsInRadius.map(async (captain) => {
            if (!captain.socketId) {
                console.log(`Captain ${captain._id} has no socketId, skipping emit`);
                return;
            }
            console.log("Emitting new-ride event to captain:", captain.socketId);
            console.log("Ride data being sent:", rideWithUser);
            sendMessageToSocketId(captain.socketId, { 
              event: 'new-ride', 
              data: rideWithUser,
            });
        }));
        res.status(201).json(ride);

    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Unable to create ride' });
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } s
}
const express = require('express');
const router = express.Router();
const {body, query}   = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const getFare = require('../services/ride.service');


router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({min: 3}).withMessage('pickup must be at least 3 characters long'),
    body('destination').isString().isLength({min: 3}).withMessage('dropoff must be at least 3 characters long'),
    body('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage('vehicleType must be one of auto, car, or moto')
    , rideController.createRide
);

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({min: 3}).withMessage('pickup must be at least 3 characters long'),
    query('destination').isString().isLength({min: 3}).withMessage('dropoff must be at least 3 characters long'),

    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('rideId must be a valid MongoDB ObjectId'),
    rideController.confirmRide
)



module.exports = router;
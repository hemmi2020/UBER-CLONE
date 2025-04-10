const express = require('express');
const router = express.Router();
const {body}   = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({min: 3}).withMessage('pickup must be at least 3 characters long'),
    body('destination').isString().isLength({min: 3}).withMessage('dropoff must be at least 3 characters long'),
    body('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage('vehicleType must be one of auto, car, or moto')
    , rideController.createRide
);



module.exports = router;
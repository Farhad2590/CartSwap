// bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Booking routes
router.post('/', bookingController.createBooking);
router.get('/:bookingId', bookingController.getBookingDetails);
router.put('/:bookingId/cancel', bookingController.cancelBooking);
router.get('/user/:userId', bookingController.getUserBookings);
router.get('/car/:carId', bookingController.getCarBookings);
router.put('/:bookingId/complete', bookingController.markBookingComplete);

module.exports = router;
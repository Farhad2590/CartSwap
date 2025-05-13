const BookingModel = require('../models/bookingModel');

const bookingController = {
  createBooking: async (req, res) => {
    try {
      const bookingData = req.body;
      const result = await BookingModel.createBooking(bookingData);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBookingDetails: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const result = await BookingModel.getBookingDetails(bookingId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  cancelBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { cancellationReason } = req.body;
      const result = await BookingModel.cancelBooking(bookingId, cancellationReason);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUserBookings: async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await BookingModel.getUserBookings(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCarBookings: async (req, res) => {
    try {
      const { carId } = req.params;
      const result = await BookingModel.getCarBookings(carId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  markBookingComplete: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { finalMileage, conditionNotes } = req.body;
      const result = await BookingModel.markBookingComplete(bookingId, finalMileage, conditionNotes);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = bookingController;
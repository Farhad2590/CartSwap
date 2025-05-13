const CarModel = require('../models/carModel');

const carController = {
  createCarPost: async (req, res) => {
    try {
      const carData = req.body;
      carData.status = 'pending'; // pending, approved, rejected
      const result = await CarModel.createCarPost(carData);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllCarPosts: async (req, res) => {
    try {
      const { status } = req.query;
      const filter = status ? { status } : {};
      const result = await CarModel.getAllCarPosts(filter);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCarPostById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await CarModel.getCarPostById(id);
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ message: 'Car post not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateCarPost: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await CarModel.updateCarPost(id, updateData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteCarPost: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await CarModel.deleteCarPost(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCarsByOwner: async (req, res) => {
    try {
      const { ownerId } = req.params;
      const result = await CarModel.getCarsByOwner(ownerId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  approveCarPost: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await CarModel.approveCarPost(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  verifyCarLicense: async (req, res) => {
    try {
      const { id } = req.params;
      const { licenseVerified } = req.body;
      const result = await CarModel.verifyCarLicense(id, licenseVerified);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  placeBid: async (req, res) => {
    try {
      const { id } = req.params;
      const bidData = req.body;
      const result = await CarModel.placeBid(id, bidData);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBidsForCar: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await CarModel.getBidsForCar(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  acceptBid: async (req, res) => {
    try {
      const { bidId } = req.params;
      const result = await CarModel.acceptBid(bidId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = carController;
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Car routes
router.post('/', carController.createCarPost);
router.get('/', carController.getAllCarPosts);
router.get('/:id', carController.getCarPostById);
router.put('/:id', carController.updateCarPost);
router.delete('/:id', carController.deleteCarPost);
router.get('/owner/:ownerId', carController.getCarsByOwner);
router.put('/approve/:id', carController.approveCarPost);
router.put('/verify/:id', carController.verifyCarLicense);

// Car bidding routes
router.post('/:id/bids', carController.placeBid);
router.get('/:id/bids', carController.getBidsForCar);
router.put('/bids/:bidId/accept', carController.acceptBid);

module.exports = router;
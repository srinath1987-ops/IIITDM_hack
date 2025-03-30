const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// Route optimization endpoints
router.get('/routes', routeController.getOptimalTruckRoutes);
router.get('/traffic', routeController.getTrafficData);
router.get('/closures', routeController.getRoadClosures);
router.post('/tolls', routeController.getTollInfo);

module.exports = router; 
import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import TripController from '../controllers/TripController';
import { isAdminAuthenticated, isUserAuthenticated } from '../middlewares/authenticator';

const router = Router();

// Authentication Routes
router.post('/auth/signup', AuthController.signUp)
  .post('/auth/signin', AuthController.signIn)
  // Trips routes
  .post('/trips', isAdminAuthenticated, TripController.createATrip)
  .get('/trips', isUserAuthenticated, TripController.getAllTrips);

module.exports = router;

import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import TripController from '../controllers/TripController';
import BookingController from '../controllers/BookingController';
import { isAdminAuthenticated, isUserAuthenticated } from '../middlewares/authenticator';

const router = Router();

// Authentication Routes
router.post('/auth/signup', AuthController.signUp)
  .post('/auth/signin', AuthController.signIn)
  // Trips routes
  .post('/trips', isAdminAuthenticated, TripController.createATrip)
  .get('/trips', isUserAuthenticated, TripController.getAllTrips)
  .patch('/trips/:tripId', isAdminAuthenticated, TripController.cancelTrip)
  // Booking routes
  .get('/bookings', isUserAuthenticated, BookingController.getBookings)
  .post('/bookings', isUserAuthenticated, BookingController.bookASeat)
  .delete('/bookings/:bookingId', isUserAuthenticated, BookingController.deleteBooking);

module.exports = router;

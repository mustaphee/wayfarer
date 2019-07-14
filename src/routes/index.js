import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();

// Authentication Routes
router.post('/auth/signup', AuthController.signUp)
  .post('/auth/signin', AuthController.signIn);

module.exports = router;

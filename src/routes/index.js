import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();

// Authentication Routes
router.post('/auth/signup', AuthController.signUp);

module.exports = router;

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { SECRET_KEY } = process.env;

const generateToken = (id, isAdmin, details) => jwt.sign({ id, isAdmin, details }, SECRET_KEY, { expiresIn: '1 day' });

export default generateToken;

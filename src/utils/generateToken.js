import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.SECRET_KEY;

const generateToken = (id, email) => jwt.sign({ id, email }, secret, { expiresIn: '1 day' });

export default generateToken;

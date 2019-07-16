/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
import '@babel/polyfill';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { SECRET_KEY } = process.env;

export const isAdminAuthenticated = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers.token;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 'error', error: 'Failed to authenticate token.' });
      } else if (decoded.isAdmin !== true) {
        return res.status(403).send({ status: 'error', message: 'You do not have access to this resource' });
      } else if (decoded.isAdmin === true) {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({ status: 'error', error: 'You can not access this resources without a token.' });
  }
};

export const isUserAuthenticated = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers.token;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 'error', error: 'Failed to authenticate token.' });
      } else if (decoded) {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({ status: 'error', error: 'You can not access this resources without a token.' });
  }
};


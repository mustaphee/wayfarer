import '@babel/polyfill';
import express from 'express';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import index from './src/routes/index';

const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic config
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {explorer: true }));

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1/', index);
// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Super Wayfarer app listening on  ${PORT}!`));

export default app;

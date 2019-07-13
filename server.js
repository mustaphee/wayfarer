import express from 'express';
import logger from 'morgan';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Basic config
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => res.send('Hello World!'));

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Super Wayfarer app listening on  ${PORT}!`));

export default app;

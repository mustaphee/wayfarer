import { Pool } from 'pg';
import 'dotenv/config';

const { CONNECTION_STRING } = process.env;

const dbConnect = async () => {
  const pool = new Pool({ connectionString: CONNECTION_STRING });
  return pool;
}

export default dbConnect;

import { Pool } from 'pg';
import dotenv from 'dotenv';


// Load environment variables from .env file
dotenv.config();

// Initialize the connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432,
});


// A helper function to run queries with typed results
export const query = async <T extends Record<string, any> = any>(
    text: string,
    params?: any[]
) => {
    const start = Date.now();
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;

    // Optional: Log queries for debugging
    console.log('executed query', { text, duration, rows: res.rowCount });

    return res;
};

export default pool;
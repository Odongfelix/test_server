import e from 'express'
import dotenv from "dotenv";

dotenv.config();

const server = e()

server.listen(3000, '0.0.0.0', (e) => {
    if (e) throw e
    console.log('Server is running on port 3000')
})

server.get('/', (req, res) => {
    res.send('Hello getter.')
})

server.get('/save-user', (req, res) => {
    saveUser('odong@gmail.com', 'felix').then(() => {
        res.send('saved')
    })
})

import {query} from './db';

// Define an interface for the expected row structure
interface User {
    id: number;
    email: string;
    created_at: Date;
}

// 1. Define the TypeScript interface for a User row
interface User {
    id: number;
    email: string;
    name: string;
    created_at: Date;
}

async function saveUser(email: string, name: string) {
    try {
        // 2. Optional: Create the table first if you haven't created one in Postgres yet
        await query(`
            CREATE TABLE IF NOT EXISTS users
            (
                id
                SERIAL
                PRIMARY
                KEY,
                email
                VARCHAR
            (
                255
            ) UNIQUE NOT NULL,
                name VARCHAR
            (
                255
            ) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
        `);

        // 3. The parameterized INSERT query
        // The 'RETURNING *' syntax tells Postgres to return the rows that were just inserted
        const insertQuery = `
            INSERT INTO users (email, name)
            VALUES ($1, $2) RETURNING *;
        `;
        const values = [email, name];

        // 4. Execute the query with type safety
        const result = await query<User>(insertQuery, values);

        const newUser = result.rows[0];
        console.log('✨ User successfully saved to database!');
        console.log(`ID: ${newUser.id} | Name: ${newUser.name} | Email: ${newUser.email}`);

        return newUser;
    } catch (error: any) {
        // Handle unique constraint violations (e.g., trying to insert the same email twice)
        if (error.code === '23505') {
            console.error('❌ Error: A user with this email already exists.');
        } else {
            console.error('❌ Error saving user:', error);
        }
    }
}
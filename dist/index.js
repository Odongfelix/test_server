"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
dotenv_1.default.config();
const server = (0, express_1.default)();
server.listen(3000, '0.0.0.0', (e) => {
    if (e)
        throw e;
    console.log('Server is running on port 3000');
});
server.get('/', (req, res) => {
    res.send('Hello getter.');
});
server.get('/save-user', (req, res) => {
    saveUser('odong@1lix', 'felix').then(() => {
        res.send('saved');
    });
});
function saveUser(email, name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 2. Optional: Create the table first if you haven't created one in Postgres yet
            yield (0, db_1.query)(`
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
            const result = yield (0, db_1.query)(insertQuery, values);
            return result.rows[0];
        }
        catch (error) {
            // Handle unique constraint violations (e.g., trying to insert the same email twice)
            console.error(error);
        }
    });
}

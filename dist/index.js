"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
server.listen(3000, '0.0.0.0', (e) => {
    if (e)
        throw e;
    console.log('Server is running on port 3000');
});
server.get('/', (req, res) => {
    res.send('Hello getter.');
});

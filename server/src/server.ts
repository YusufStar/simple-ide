// src/server.ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import runCode from './api/run';
import cors from "cors"

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors())

app.get("/", (req: Request, res: Response) => {
    res.send("Health Check Ok")
})

// Route
app.post('/api/run',
    //@ts-ignore
    runCode);  // Attach your route handler here

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

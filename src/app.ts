import express, { Request, Response } from "express";
import dotenv from "dotenv";

import contactRoutes from "./routes/contact.routes";

dotenv.config();
const app = express();

app.use(express.json());
app.use(contactRoutes);

// basic health check
app.get("/ping", (_req: Request, res: Response) => {
    res.send("pong");
});

export default app;
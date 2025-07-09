import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { Contact } from "./models/contact.model";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    },
    entities: [Contact],
    synchronize: true,
    logging: false
});
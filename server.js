import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import morgan from "morgan";
import { dbClient } from "./db/dbConnection.js";
const app = express();

// Database Connection
dbClient();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Constant Vars
const PORT = process.env.PORT || 4000;

app.get("/", async (req, res) => {
    res.send("Hello world!");
});

app.listen(PORT, () => {
    console.log(`Server is running/listening on port ${PORT}`);
});

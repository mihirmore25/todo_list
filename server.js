import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";

// Constant Vars
const PORT = process.env.PORT || 4000;

const app = express();

app.get("/", async (req, res) => {
    res.send("Hello world!");
});

app.listen(PORT, () => {
    console.log(`Server is running/listening on port ${PORT}`);
});

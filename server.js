import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import userRoutes from "./routes/users.js";
import morgan from "morgan";
import { dbClient } from "./db/dbConnection.js";
const app = express();

// Database Connection
dbClient();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));

// Constant Vars
const PORT = process.env.PORT || 4000;

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", async (req, res) => {
    res.send("Hello world!");
});

app.listen(PORT, () => {
    console.log(`Server is running/listening on port ${PORT}`);
});

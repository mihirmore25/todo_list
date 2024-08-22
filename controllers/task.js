import { User } from "../models/User.js";
import { Task } from "../models/Task.js";
import jwt from "jsonwebtoken";

export const createTask = async (req, res) => {
    let token;

    token = req.cookies.access_token;

    console.log("Token --> ", token);

    if (!token)
        return res.status(401).json({
            status: false,
            error: res.statusCode,
            message:
                "Not authorize to access this route, Please try logging in first.",
        });

    const { title, description } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, async (err, user_data) => {
        if (err) {
            return res.status(401).json({
                message: "This session has expired! Please login.",
            });
        }

        const newTask = await Task.create({
            title,
            description,
            user: user_data.id,
        });

        const newCreatedTask = await newTask.save();
        console.log(newCreatedTask);

        return res.status(200).json({
            status: true,
            data: newCreatedTask._doc,
            message: "New Task created successfully.",
        });
    });
};

export const getTasks = async (req, res) => {
    const tasks = await Task.find()
        .limit(10)
        .sort({ createdAt: -1 })
        .select("-__v");

    if (tasks.length === 0 || tasks === null || 0 || tasks === undefined) {
        return res.status(404).json({
            status: false,
            message: "Tasks not found! Try creating new tasks.",
        });
    }

    return res.status(200).json({
        status: true,
        data: tasks,
    });
};

export const getTask = async (req, res) => {
    let taskId = req.params.id;

    if (!taskId || String(taskId).length < 24) {
        return res.status(404).json({
            status: false,
            message: "Please search task with valid task id.",
        });
    }

    const task = await Task.findById(taskId).select("-__v");

    if (taskId && (task === null || undefined || 0)) {
        return res.status(404).json({
            status: false,
            message: `Task did not found with ${taskId} id.`,
        });
    }

    return res.status(200).json({
        status: true,
        data: task,
    });
};

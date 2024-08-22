import { User } from "../models/User.js";
import { Task } from "../models/Task.js";
import jwt from "jsonwebtoken";

// Create a new task
export const createTask = async (req, res) => {
    let token;
    // Store access token from cookies in token variable
    token = req.cookies.access_token;

    console.log("Token --> ", token);

    // Check valid token otherwise return error with '401' status code
    if (!token)
        return res.status(401).json({
            status: false,
            error: res.statusCode,
            message:
                "Not authorize to access this route, Please try logging in first.",
        });

    // Extract title & description from request body object
    const { title, description } = req.body;

    // Verify json web token with secret key
    jwt.verify(token, process.env.JWT_SECRET, async (err, user_data) => {
        // Check error while verify otherwise return error with '401' status code
        if (err) {
            return res.status(401).json({
                message: "This session has expired! Please login.",
            });
        }

        // Create newTask object with Task model from mongoose schema
        // Pass title & description from request body
        const newTask = await Task.create({
            title,
            description,
            user: user_data.id,
        });

        // Save newTask object in db
        const newCreatedTask = await newTask.save();
        console.log(newCreatedTask);

        // Return successful new task creation response with '200' status code
        // And newly created task document
        return res.status(200).json({
            status: true,
            data: newCreatedTask._doc,
            message: "New Task created successfully.",
        });
    });
};

// Get all the tasks
export const getTasks = async (req, res) => {
    // Fetching all the tasks from the db with server
    // with limit of '10'
    // sort with creation date
    const tasks = await Task.find()
        .limit(10)
        .sort({ createdAt: -1 })
        .select("-__v");

    // Check if tasks length is '0' or 'null' or 'undefined' while fetch from db
    if (tasks.length === 0 || tasks === null || 0 || tasks === undefined) {
        // Return error with '404' status code
        return res.status(404).json({
            status: false,
            message: "Tasks not found! Try creating new tasks.",
        });
    }

    // Return successful response with '200' status code 
    // with all tasks
    return res.status(200).json({
        status: true,
        data: tasks,
    });
};

// Get a Single Task
export const getTask = async (req, res) => {
    // Extract task id from request params/url
    let taskId = req.params.id;

    // Check task id should be of length '24'
    if (!taskId || String(taskId).length < 24) {
        // Return response with error '404' status code
        return res.status(404).json({
            status: false,
            message: "Please search task with valid task id.",
        });
    }

    // Fetching task from db based on valid task id
    const task = await Task.findById(taskId).select("-__v");

    // Task should be not 'null' or 'undefined' or '0' 
    if (taskId && (task === null || undefined || 0)) {
        // Return response with error '404' status code
        return res.status(404).json({
            status: false,
            message: `Task did not found with ${taskId} id.`,
        });
    }

    // Return successful response with '200' status code
    // with corresponding task data
    return res.status(200).json({
        status: true,
        data: task,
    });
};

// Update task with given respective task id
export const updateTask = async (req, res) => {
    // Extract title, description & status from request body object
    const { title, description, status } = req.body;

    // Extract task id from request params/url
    let taskId = req.params.id;

    // Check task id should be of length '24'
    if (!taskId || String(taskId).length < 24) {
        // Return response with error '404' status code
        return res.status(404).json({
            status: false,
            message: "Please search task with valid task id.",
        });
    }

    // Fetching task from db based on valid task id
    const task = await Task.findById(taskId);

    // Task should be not 'null' or 'undefined' or '0'
    if (taskId && (task === null || undefined || 0)) {
        // Return response with error '404' status code
        return res.status(404).json({
            status: false,
            message: `Task did not found with ${taskId} id.`,
        });
    }

    console.log("User ---> ", req.user);

    // Check if task creator or only admin could update task
    if (
        req.user._id.toString() == task.user.toString() ||
        req.user.role == "admin"
    ) {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                title,
                description,
                status,
            },
            { new: true }
        ).select("-__v");

        console.log("Updated Task ---> ", updatedTask);

        // Return successful response with '200' status code
        // with updated task data
        return res.status(200).json({
            status: true,
            data: updatedTask,
            message: "Task has been updated successfully.",
        });
    }
};

// Delete a Task with task id
export const deleteTask = async (req, res) => {
    // Extract task id from request params/url
    let taskId = req.params.id;

    // Check task id should be of length '24'
    if (!taskId || String(taskId).length < 24) {
        // Return response with error '404' status code
        return res.status(404).json({
            status: false,
            message: "Please search task with valid task id.",
        });
    }

    // Fetching task from db based on valid task id
    const task = await Task.findById(taskId);

    // // Task should be not 'null' or 'undefined' or '0'
    if (taskId && (task === null || undefined || 0)) {
        // Return response with error '404' status code
        return res.status(404).json({
            status: false,
            message: `Task did not found with ${taskId} id.`,
        });
    }

    // Check if task creator or only admin could update task
    if (
        req.user._id.toString() == task.user.toString() ||
        req.user.role == "admin"
    ) {
        // Delete task with respective task id given in request
        const deletedTask = await Task.deleteOne({ _id: taskId });

        console.log("Deleted Task --> ", deletedTask);

        // Return successful response with '200' status code
        // with deleted task acknowledgment from db
        return res.status(200).json({
            status: false,
            data: deletedTask,
            message: "Task has been deleted successfully.",
        });
    }

    // Return error response with '400' status code
    return res.status(400).json({
        status: false,
        message: "You can only delete your own task.",
    });
};

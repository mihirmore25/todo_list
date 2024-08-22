import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Checking if user is already exist in our db or
// Creating/Registering a New user in our db
export const register = async (req, res) => {
    // Extracting username, email & password from request body object
    const { username, email, password } = req.body;
    console.log("Req Body --> ", req.body);

    // Check if all the fields are filled
    if (!username || !email || !password) {
        return res.status(400).json({
            status: false,
            error: res.statusCode,
            data: [],
            message: "Username, Email, Password are required",
        });
    }

    // Create newUser object with given username, email & password
    const newUser = new User({
        username,
        email,
        password,
    });

    // Check if the new user is already in our db
    const userExist = await User.findOne({ email });

    console.log("User Exist --> ", userExist);

    // if user exists then
    // Return error response with '400' status code
    if (userExist) {
        res.status(400).json({
            status: false,
            error: res.statusCode,
            data: [],
            message:
                "It seems you already have an account, please log in instead.",
        });
    }

    // Save new user in db
    const savedUser = await newUser.save();

    // Extracting only user data from saved user
    const { role, ...user_data } = savedUser._doc;

    console.log("User Data ---> ", user_data);

    // Return successful creation response with '201' status code
    // with user data 
    return res.status(201).json({
        status: true,
        data: [user_data],
        message:
            "Thank you for registering with us. Your account has been created successfully.",
    });
};

// Signing/Logging in the User with his valid credentials
export const login = async (req, res) => {
    // Extract email from request body object
    const { email } = req.body;

    // Check if email & password are given/filled
    if (!email || !req.body.password) {
        // Return error response with '400' status code
        return res.status(400).json({
            status: false,
            error: res.statusCode,
            data: [],
            message: "Email, Password are required",
        });
    }

    // Fetching user with given email
    const user = await User.findOne({ email }).select("+password");

    // Check if not user
    // Return error response with '401' status code
    if (!user) {
        return res.status(401).json({
            status: true,
            data: [],
            message:
                "Invalid email or password. Please try again with the correct credentials.",
        });
    }

    // Check if given password is valid
    const isPasswordValid = bcrypt.compareSync(
        req.body.password,
        user.password
    );

    if (!isPasswordValid) {
        // Return error response with '401' status code
        return res.status(401).json({
            status: false,
            data: [],
            message:
                "Invalid email or password. Please try again with the correct credentials.",
        });
    }

    // Extracting only user data from user
    const { password, ...user_data } = user._doc;

    let options = {
        expiresIn: 24 * 60 * 60 * 1000, // would expire in 1 day
        httpOnly: true, // The cookie is only accessible by the web server
    };

    const token = user.generateJWT();

    // Return successful response with '200' status code
    // with logged in user data
    return res
        .cookie("access_token", token, options)
        .status(200)
        .json({
            status: true,
            data: [user_data],
            token,
            message: "You have successfully logged in.",
        });
};

// Signing/Logging Out the user from server
export const logout = async (req, res) => {
    // console.log(req.cookies.access_token);

    let token;

    token = req.cookies.access_token;

    // Verify json web token to validate valid user
    let user_data = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(user_data.id);
    console.log(user);

    // Return successful response wit '200' status code
    // clear session cookie 
    return res
        .clearCookie("access_token", {
            sameSite: "none",
            secure: true,
        })
        .status(200)
        .json({
            status: false,
            data: [],
            message: "You have been logged out successfully...",
        });
};

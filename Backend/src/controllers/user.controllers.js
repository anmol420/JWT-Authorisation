import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullname, email, password } = req.body;

    if (!(username && fullname && email && password)) {
        throw new ApiError(404, "Fields Not Found !");
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}],
    });
    if (existedUser) {
        throw new ApiError(409, "User Already Exists !");
    }

    const createdUser = await User.create({
        username: username.toLowerCase(),
        fullname: fullname,
        email: email,
        password: password
    });

    if(!createdUser) {
        throw new ApiError(500, "Internal Server Error.")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdUser,
                "User Registered Successfully."
            )
        );
});

const loginUser = asyncHandler( async (req, res) => {
    const { username, email, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "Username Or Email Is Required.");
    }

    if (!password) {
        throw new ApiError(400, "Password Is Required.");
    }

    const userFound = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!userFound) {
        throw new ApiError(404, "User Not Found, Register.");
    }

    const isPasswordValid = await userFound.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password.");
    }

    const token = jwt.sign({ id: userFound._id }, process.env.TOKEN_SECRET, {
        expiresIn: '7d'
    });

    const user = await User.findById(userFound._id).select(
        "-password"
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user: user, token },
                "Logged In Successfully."
            )
        );
});

// optional route
const logoutUser = asyncHandler( async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { token: null },
                "Logged Out Successfully."
            )
        );
});

const dashboard = asyncHandler( async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        throw new ApiError(404, "Token Not Found.");
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(verified.id).select('-password');
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { user },
                    "User Found."
                )
            )
    } catch (error) {
        throw new ApiError(404, "User Not Found.");
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    dashboard
};
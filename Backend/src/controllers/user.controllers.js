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

const generateAccessRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.refreshToken = refreshToken;
        await user.save({ ValidateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError("Something Went Wrong While Generation of Token");
    }
};

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

    // generation token
    const { accessToken, refreshToken } = await generateAccessRefreshTokens(
        userFound._id
    );

    const user = await User.findById(userFound._id).select(
        "-password -refreshToken"
    );

    // making cookie not modifiable
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: user, accessToken, refreshToken },
                "Logged In Successfully."
            )
        );
});

const logoutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            },
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User Logged Out !"
            )
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || res.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request.");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError("Invalid Refresh Token.");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token Is Expired.");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const newToken = await generateAccessRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", newToken.accessToken, options)
            .cookie("refreshToken", newToken.refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken: newToken.accessToken,
                        refreshToken: newToken.refreshToken,
                    },
                    "Access Token Refreshed."
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token.");
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};
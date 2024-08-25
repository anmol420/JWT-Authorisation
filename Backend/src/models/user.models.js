import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "Username Is Required !"],
            lowercase: true,
            index: true,
            trim: true
        },
        fullname: {
            type: String,
            required: [true, "FullName Is Required !"],
            index: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email Is Required !"],
            trim: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password Is Required !"]
        },
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
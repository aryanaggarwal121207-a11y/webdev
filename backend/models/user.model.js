import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,     //removes whitespace
            minLength: 1,
            maxLength: 50
        },
        password: {
            type: String,
            required: true,
            minLength: 5,
            maxLength: 50
        },
        email: { //can add email formatting here also
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Before saving any passwords, hash them
/*
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next() // Only hash it if it changes
    this.password = await bcrypt.hash(this.password, 10) // 10 salt rounds

    next();
});*/

// Simplified, modern async hook (Preferred) Note: 'next' is omitted entirely. Mongoose waits for the async function to complete.
userSchema.pre("save", async function() {
    if (!this.isModified("password")) { return; }
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare passwords
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)

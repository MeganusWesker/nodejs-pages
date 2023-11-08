import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter you're name"],
        minlength: [3, "name should be more than of 2 characters"]
    },
    email: {
        type: String,
        required: [true, "please enter you're email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "please enter you're password"],
        minlength: [8, "password should be more than of 7 characters"],
        select: false
    },

    age:{
        type:Number,
        required:[true,"please enter you're name"]
        
    }


});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
export const User = mongoose.model('User', userSchema);

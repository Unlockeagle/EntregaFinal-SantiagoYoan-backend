import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        require: true,
    },
    last_name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        index: true,
    },
    age: {
        type: Number,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart",
        require: true,
    },
    role: {
        type: String,
        require: true,
        enum: ["user", "admin"],
        default: "user",
    },
});

const UserModel = mongoose.model("users", userSchema);

export default UserModel;

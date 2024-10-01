import mongoose from "mongoose";
import configObject from "../config/config.js";

const { mongoUrl } = configObject;

const database = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log("Database connected 🍃");
    } catch (error) {
        console.log("Error connecting to MongoDB ⚠️", error);
    }
};
database();

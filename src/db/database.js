import mongoose from "mongoose";

const database = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://santiagoyoan:coderhouse@cluster0.zqask.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0"
        );
        console.log("Database connected 🍃");
    } catch (error) {
        console.log("Error connecting to MongoDB ⚠️", error);
    }
};
database();

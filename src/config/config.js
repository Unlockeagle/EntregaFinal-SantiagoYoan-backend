import dotenv from "dotenv";
import program from "../utils/commander.js";

const { mode } = program.opts();

dotenv.config({
    path: mode === "production" ? "./.env.production" : "./.env.development",
});

const configObject = {
    puerto: process.env.PUERTO,
    mongoUrl: process.env.MONGO_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECERT,
    callbackUrl: process.env.CALLBACK_URL,
    secretOrKey: process.env.SECRET_OR_KEY,
    secret: process.env.SECRET
};

export default configObject;

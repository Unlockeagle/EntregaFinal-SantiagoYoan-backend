import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { engine } from "express-handlebars";
import ProductsRouter from "./routers/products.router.js";
import ViewsRouter from "./routers/views.router.js";
import CartRouter from "./routers/carts.router.js";
import SessionRouter from "./routers/sessions.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js"
import cookieParser from "cookie-parser";

import "./db/database.js";

const app = express();
const PORT = 8080;

// Midleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())
app.use(
    session({
        secret: "coderhouse",
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl:
                "mongodb+srv://santiagoyoan:coderhouse@cluster0.zqask.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0",
            ttl: 100,
        }),
    })
);



// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/", ProductsRouter);
app.use("/", CartRouter);
app.use("/api/sessions", SessionRouter);
app.use("/", ViewsRouter);

// Listen
app.listen(PORT, () => {
    console.log(`Server on port: http://localhost:${PORT} 🚀 `);
});
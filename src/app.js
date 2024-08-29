import express from "express";
import { engine } from "express-handlebars";
import ProductsRouter from "./routers/products.router.js"
import ViewsRouter from "./routers/views.router.js"
import CartRouter from "./routers/carts.router.js"
import "./db/database.js"

const app = express();
const PORT = 8080;


// Midleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Handlebars

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

// Rutas
app.use("/", ProductsRouter)
app.use("/", ViewsRouter)
app.use("/", CartRouter)
app.get("/", (req, res) => {
    res.send("Hello Word");
});

app.get("/products", (req, res) => {
    res.render("products", {title: "Products"})
})


// Listen
app.listen(PORT, () => {
    console.log(`🚀 Server on port: http://localhost:${PORT}`);
});

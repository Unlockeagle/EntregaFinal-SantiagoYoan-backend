import { json, Router } from "express";
import ProductManager from "../controller/productManager.js";
import CartManager from "../controller/cartManager.js";

const router = Router();
const manager = new ProductManager();
const cartManager = new CartManager();

//#region Products
router.get("/products", async (req, res) => {
    try {
        const categories = req.query.category;
        const sort = req.query.sort; // sort: asc/desc

        const limit = parseInt(req.query.limit, 10) || 10;
        const page = parseInt(req.query.page, 10) || 1;
        const options = {
            limit: limit,
            page: page,
        };

        const products = await manager.getProducts(options, categories, sort);
        const prevLink = products.hasPrevPage
            ? `/products?page=${products.prevPage}&limit=${limit}${categories ? `&category=${categories}` : ""}${
                  sort ? `&sort=${sort}` : ""
              }`
            : null;
        const nextLink = products.hasNextPage
            ? `/products?page=${products.nextPage}&limit=${limit}${categories ? `&category=${categories}` : ""}${
                  sort ? `&sort=${sort}` : ""
              }`
            : null;

        // Convertir cada producto a un objeto plano
        const plainProducts = products.docs.map((product) => {
            const { ...rest } = product.toObject();
            return rest;
        });

        // Pasa los productos directamente a la vista
        res.render("products", {
            products: plainProducts,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPage: products.totalPages,
            prevLink,
            nextLink,
        });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error al obtener los productos");
    }
});

// get Products on database By Id
router.get("/products/details/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const productById = await manager.getProductsById(id);

        // Convertir cada producto a un objeto plano
        const plainProductById = productById.toObject();

        res.render("details", { plainProductById });
    } catch (error) {
        console.error("Error en el router:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

//#region cart
//Ruta para obtener un carrito por su ID
router.get("/carts/:id", async (req, res) => {
    const cartId = req.params.id;
    try {
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            return res.render("cart", { cart });
        }
        //const plainCart = await cart.toObject()

        res.render("cart", { cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//#region Realtime
router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
});

//#region Sessions
router.get("/login", async (req, res) => {

    if (req.session.user) {
        res.redirect("/profile");
    }
    res.render("login");
});
router.get("/register", async (req, res) => {
    res.render("register");
});
router.get("/profile", async (req, res) => {

    
    if(!req.session.login){
        return res.redirect("/login")
    }
    res.render("profile", {user: req.session.user});
});


export default router;

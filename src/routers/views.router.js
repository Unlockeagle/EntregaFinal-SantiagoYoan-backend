import { Router } from "express";
import ProductManager from "../controller/productManager.js";
import CartManager from "../controller/cartManager.js";

const router = Router();
const manager = new ProductManager();
const cartManager = new CartManager()

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
        const plainProductById = productById.toObject()
        
        
        res.render("details", {plainProductById})
    } catch (error) {
        console.error("Error en el router:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

//Ruta para obtener un carrito por su ID
router.get('/carts/:id', async (req, res) => {
    const cartId = req.params.id;
    try {
        const cart = await cartManager.getCartById(cartId);
        const plaicart = await cart.toObject()
        
        if (!cart) {
            return res.render("cart", {plaicart})
        }
        res.render("cart", {plaicart})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Ruta para añadir un producto a un carrito
router.post("/api/carts/:id/products/", async (req, res) => {
    const cartId = req.params.id;
    const productId = req.params.id;
    const quantity = req.body

    if (!productId || !quantity) {
        return res.status(400).json({ message: "productId y quantity son requeridos" });
    }

    try {
        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

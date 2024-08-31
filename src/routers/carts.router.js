import { Router } from "express";
import CartManager from "../controller/cartManager.js";

const router = Router();
const manager = new CartManager();

// Ruta para crear un nuevo carrito
router.post("/api/carts", async (req, res) => {
    try {
        const newCart = await manager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para obtener todos los carritos
router.get("/api/carts", async (req, res) => {
    try {
        const carts = await manager.getCarts();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para obtener un carrito por su ID
router.get("/api/carts/:id", async (req, res) => {
    const cartId = req.params.id;
    try {
        const cart = await manager.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para añadir un producto a un carrito
router.post("/api/carts/:cartId/products/:productId", async (req, res) => {
    const cartId = req.params.cartId;
    const prodId = req.params.productId
    const quantity = parseInt(req.body.quantity, 10) || 1;

    try {
        const addProduct = await manager.addProductToCart(cartId, prodId, quantity)
        res.status(201).json({message: "Producto agregado", addProduct})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Ruta para eliminar un producto de un carrito
// router.delete("/api/carts/:cartId/products/:productId", async (req, res) => {
//     const cartId = req.params.cartId;
//     const productId = req.params.productId;

//     try {
//         const deletedProduct = await manager.deleteProductFromCart(cartId, productId);
//         if (!deletedProduct) {
//             return res.status(404).json({ message: "Producto no encontrado en el carrito" });
//         }
//         res.status(200).json({ message: "Producto eliminado", deletedProduct });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

export default router;

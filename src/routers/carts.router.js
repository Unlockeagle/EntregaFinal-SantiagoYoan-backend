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
router.put("/api/carts/:cartId", async (req, res) => {
    const cartId = req.params.cartId;
    const prodId = req.body.product;
    
    const quantity = parseInt(req.body.quantity, 10) || 1;

    try {
        const addProductToCart = await manager.addProductToCart(cartId, prodId, quantity);
        res.status(201).send({message: "Producto agregado exitosamente al carrito", addProductToCart})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualiza la cantidad de los productos en el carrito
router.put("/api/carts/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const quantity = req.body.quantity;
    console.log(req.body)

    try {
        const updatedQuantity = await manager.updateQuantity(cartId, prodId, quantity);
        res.status(201).send({ message: "Cantidad actualizada exitosamente en el carrito desde el servidor", updatedQuantity });
    } catch (error) {
        res.status(500).send({ message: "Error al Actualizar cantidad del producto en el carrito desde el servidor", error });
    }
});

//Ruta para eliminar un producto de un carrito
router.delete("/api/carts/:cartId/products/:productId", async (req, res) => {
    const cartId = req.params.cartId;
    const productId = req.params.productId;

    try {
        const deletedProduct = await manager.deleteProductFromCart(cartId, productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }
        res.status(200).json({ message: "Producto eliminado", deletedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// elimina todos los productos del carrito
router.delete("/api/carts/:cid", async (req, res) => {
    const cartId = req.params.cid
    try {
        const emptyCart = await manager.deleteAllProductsToCart(cartId)
        res.status(201).send({ message: "Todos los productos del carrito han sido eliminado exitosamente en el carrito desde el servidor", emptyCart });
    } catch (error) {
        res.status(500).send({ message: "Error al eliminar todos los productos en el carrito desde el servidor", error });
    }
})




export default router;

import CartModel from "../db/models/cart.model.js";

class CartManager {
    async createCart() {
        try {
            const newCart = await new CartModel({ products: [] });
            newCart.save();
            return newCart;
        } catch (error) {
            throw new Error("Error al crear un carrito" + error.message);
        }
    }

    async getCarts() {
        try {
            const carts = await CartModel.find();

            return carts;
        } catch (error) {
            throw new Error("Error al buscar carritos" + error.message);
        }
    }

    async getCartById(cartId) {
        try {
            const cartByID = await CartModel.findById(cartId).populate("products.product").lean();

            if (!cartByID) {
                console.log("No existe ese carrito");
                return null;
            }

            return cartByID;
        } catch (error) {
            throw new Error("Error al buscar carrito" + error.message);
        }
    }
    // Add product to cart
    async addProductToCart(cartId, prodId, quantity = 1) {
        try {
            const cart = await CartModel.findById(cartId);

            const existsProduct = await cart.products.find((item) => item.product.equals(prodId));

            if (existsProduct) {
                existsProduct.quantity += quantity;
            } else {
                cart.products.push({ product: prodId, quantity });
            }

            //marcamos product como modificada, con eaquals no es necesario ya que mongoose lo resuelve
            //cart.markModified("products");

            await cart.save();

            return cart;
        } catch (error) {
            throw new Error("Error al agregar producto al carrito" + error.message);
        }
    }

    
    // Actualiza las cantidades de los productos
    async updateQuantity(cartId, prodId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            const product = await cart.products.find((product) => product.product.equals(prodId));
            if (product) {
                product.quantity += quantity;
            } else {
                console.log("No existe el producto");
            }
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al Actualizar cantidades de producto al carrito: " + error.message);
        }
    }

    // Delete Product
    async deleteProductFromCart(cartId, prodId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const productIndex = cart.products.findIndex((product) => {
                return product.product._id.toString() === prodId;
            });

            if (productIndex === -1) {
                throw new Error("Producto no encontrado en el carrito");
            }

            const deletedProduct = cart.products.splice(productIndex, 1);

            await cart.save();

            return deletedProduct;
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito: " + error.message);
        }
    }

    // Elimina todos los productos del carrito
    async deleteAllProductsToCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (cart) {
                cart.products = [];
            }

            await cart.save();
            console.log(cart.products);
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito: " + error.message);
        }
    }
}

export default CartManager;

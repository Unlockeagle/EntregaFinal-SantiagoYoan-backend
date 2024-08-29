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
            console.log(carts);

            return carts;
        } catch (error) {
            throw new Error("Error al buscar carritos" + error.message);
        }
    }

    async getCartById(cartId) {
        try {
            const cartByID = await CartModel.findById(cartId);
            if (!cartByID) {
                console.log("No existe ese carrito");
                return null;
            }
            return cartByID;
        } catch (error) {
            throw new Error("Error al buscar carrito" + error.message);
        }
    }

    async addProductToCart(cartId, prodId, quantity) {
        try {
            const cart = await this.getCartById(cartId);
            const existsProduct = cart.products.find((item) => item.product.toString() === prodId);

            if (existsProduct) {
                existsProduct.quantity += quantity;
            } else {
                cart.products.push({ product: prodId, quantity: quantity });
            }

            //marcamos la propiedad "products" modificada antes de guardar
            cart.markModified("products");
            await cart.save();
            console.log("product add to cart");

            return cart;
        } catch (error) {
            throw new Error("error add to cart" + error.message);
        }
    }
    // Delete Product
    async deleteProductFromCart(cartId, prodId) {
        try {
            // Encuentra el carrito por su ID
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const productIndex = cart.products.findIndex((product) => product._id.toString() === prodId);

            if (productIndex === -1) {
                throw new Error("Producto no encontrado en el carrito");
            }

            // Elimina el producto del array `products`
            const deletedProduct = cart.products.splice(productIndex, 1);

            // Guarda los cambios en el carrito
            await cart.save();

            console.log("Deleted Product:", deletedProduct);
            return deletedProduct;
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito: " + error.message);
        }
    }
}

export default CartManager;

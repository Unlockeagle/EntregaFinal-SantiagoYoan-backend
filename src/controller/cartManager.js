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
            const cart = await CartModel.findById(cartId)
          
            const existsProduct = await cart.products.find((item) => item.product.toString() === prodId);

            if (existsProduct) {
                existsProduct.quantity += quantity;
                
            } else {
                cart.products.push({ product: prodId, quantity: quantity.quantity });
            }

            //marcamos product como modificada
            cart.markModified("products");
       
            await cart.save();

            
            return cart;
        } catch (error) {
            throw new Error("Error al agregar producto al carrito" + error.message);
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

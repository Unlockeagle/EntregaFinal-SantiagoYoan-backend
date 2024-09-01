import fs from "fs/promises";

class CartManager {
  static ultId = 0;
  constructor(path) {
    this.cart = [];
    this.path = path;
    this.updateId();
  }
  //metodo auxiliar para actualizar ultId
  async updateId() {
    const arrayCarts = await this.readCart();
    if (arrayCarts.length > 0) {
      CartManager.ultId = arrayCarts[arrayCarts.length - 1].id;
      return;
    }
  }

  //metodo Auxiliar leer cart
  async readCart() {
    const arrayCarts = await fs.readFile(this.path, "utf-8");
    const response = JSON.parse(arrayCarts);
    return response;
  }

  //Metoso auxiliar guardar cart
  async saveCart(arrayCarts) {
    await fs.writeFile(this.path, JSON.stringify(arrayCarts, null, 2));
    return;
  }

  //metodo getcart
  async getCarts() {
    const arrayCarts = await this.readCart();
    return arrayCarts;
  }

  //Crear carrito
  async createCart(newCart) {
    //leemos el array de carrito
    const arrayCarts = await this.readCart();

    // desestructuramos el nuevo carrito
    const { products } = newCart;

    // creamos el objeto
    const cart = {
      id: ++CartManager.ultId,
      products: [],
    };

    //pusheamos el nuevo objeto en el array de carritos
    arrayCarts.push(cart);

    try {
      //Guardamos el arrayCarts con el nuevo carrito
      await this.saveCart(arrayCarts);

      return console.log("Nuevo carrito Creado");
    } catch (error) {
      return console.error("Error al crear carrito", error);
    }
  }

  //Obtenemos la informacion de los carrito por su id de carrito
  async getCartById(id) {
    try {
      // Leemos el array de carritos
      const arrayCarts = await this.readCart();

      // Buscamos en el array el id
      const cartById = arrayCarts.find((el) => el.id === id);

      if (cartById) {
        console.log(`Carrito numero: ${id} encontrado`);
        return cartById.products;
      } else {
        return console.log(`El carrito ${id} no se encuentra`);
      }
    } catch (error) {
      return console.log(`Error al obtener el carrito con id ${id}:`, error);
    }
  }

  async addProductToCart(cid, pid, quantity = 1) {
    // Leemos el array de carritos
    const arrayCarts = await this.readCart();

    // Buscamos el carrito
    const findCart = arrayCarts.find((el) => el.id === cid);
    if (!findCart) {
      console.log("El carrito no existe");
      return;
    }

    // Buscamos si el producto ya existe en el carrito
    const productIndex = findCart.products.findIndex(
      (product) => product.product === pid
    );

    try {
      if (productIndex === -1) {
        // El producto no existe en el carrito, lo agregamos
        findCart.products.push({
          product: pid,
          quantity: quantity,
        });
        console.log("Producto agregado exitosamente");
        // Guardamos el array de carritos
        await this.saveCart(arrayCarts);
        return findCart.products;
      } else {
        // El producto ya existe, actualizamos la cantidad
        findCart.products[productIndex].quantity += quantity;
        console.log("Cantidad de producto actualizada exitosamente");
        // Guardamos el array de carritos
        await this.saveCart(arrayCarts);
        return findCart.products;
      }
    } catch (error) {
      console.error("Error al agregar el producto al carrito", error);
    }
  }
}

export default CartManager;

// La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
// Id:Number/String (A tu elección, de igual manera como con los productos,
// debes asegurar que nunca se dupliquen los ids y que este se autogenere).
// products: Array que contendrá objetos que representen cada producto

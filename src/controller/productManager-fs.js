import fs from "fs/promises";
class ProductManager {
  static ultId = 0;
  constructor(path) {
    this.products = [];
    this.path = path;
    this.updateID();
  }
  //Actualiza el ultId
  async updateID() {
    const arrayProducts = await this.readProducts();
    if (arrayProducts.length > 0) {
      ProductManager.ultId = arrayProducts[arrayProducts.length - 1].id;
      return;
    }
  }
  //Lee los productos dentro del array
  async getProducts() {
    const arrayProducts = this.readProducts();
    return arrayProducts;
  }
  //lee y busca un producto dentro del array segun su id
  async getProductsById(id) {
    const arrayProducts = await this.readProducts();
    const productById = await arrayProducts.find((el) => el.id == id);
    return productById;
  }
  //Lee los productos metodo auxiliar
  async readProducts() {
    const arrayProducts = await fs.readFile(this.path, "utf-8");
    const respuesta = JSON.parse(arrayProducts);
    return respuesta;
  }
  //Guarda los productos metodo auxiliar
  async saveProduct(arrayProducts) {
    await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
    return;
  }
  //Agrega nuevos productos al array y al Archivo de productos
  async addProduct(newProduct) {
    //leemos el array
    const arrayProducts = await this.readProducts();
    //se reciben los parametros
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = newProduct;

    //Validamos que existan los campos requeridos
    if (!title || !description || !code || !price || !stock || !category) {
      console.log("Todos los Campos deben ser completados");
      return;
    }
    //Validamos que los codigos sean unicos
    if (arrayProducts.some((el) => el.code == code)) {
      console.log("Los codigos deben ser diferentes");
      return;
    }

    const product = {
      id: ++ProductManager.ultId,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: Array.isArray(thumbnails) ? thumbnails : [thumbnails],
    };

    //Agregamos los thumbnails

    //Agregamos el producto al array
    arrayProducts.push(product);

    //reescribir el archivo

    try {
      await this.saveProduct(arrayProducts);
      return console.log("Producto agregado");
    } catch (error) {
      console.error("Error al guardar el producto", error);
      return;
    }
  }
  //Actualizamos un producto por su ID
  async updateProduct(id, productoActualizado) {
    //leemos el array
    const arrayProducts = await this.readProducts();

    //buscamos el id ene l aarray de productos
    const productIndex = arrayProducts.findIndex((el) => el.id == id);

    try {
      if (productIndex != -1) {
        //actualizamos el objeto encontrado por el index
        arrayProducts[productIndex] = {
          //hacemos una copia el objeto existente
          ...arrayProducts[productIndex],
          //y lo combinamos con el objeto actualizado
          ...productoActualizado,
        };
      }
      //guardamos el array
      await this.saveProduct(arrayProducts);
      console.log("Producto actualizado");
    } catch (error) {
      console.error("Producto no encontrador", error);
    }
  }

  //Borar un producto por su ID
  async deleteProduct(id) {
    //leemos el array
    const arrayProducts = await this.readProducts();

    //buscamos el indice en el array de productos
    const productIndex = await arrayProducts.findIndex((el) => el.id == id);

    try {
      if (productIndex != -1) {
        await arrayProducts.splice(productIndex, 1);
        console.log("Producto eliminado");
      }
      //guardamos el array
      await this.saveProduct(arrayProducts);
      console.log("producto eliminado");
    } catch (error) {
      console.log("error al eliminar producto", error);
    }
  }
}

export default ProductManager;

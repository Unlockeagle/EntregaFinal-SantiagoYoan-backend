import ProductModel from "../db/models/product.model.js";
class ProductManager {
    // Create Products
    async createProduct({ title, description, code, price, stock, category, thumbnails }) {
        try {
            if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
                console.log("Todos los campos son requeridos");
                throw new Error("Todos los campos son requeridos");
            }

            const existsCode = await ProductModel.findOne({ code });
            if (existsCode) {
                console.log("Los codigos deben ser unicos");
                throw new Error("Los codigos deben ser unicos");
            }

            const newDocument = await new ProductModel({
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails: thumbnails || [],
            });
            newDocument.save();
            console.log("Nuevo Producto creado exitosamente");
        } catch (error) {
            console.log("Error al crear producto", error);
            throw error;
        }
    }
    // get Products on database
    async getProducts(options, categories, sort) {
        try {
            // Convertir el valor de sort en el formato correcto para Mongoose
            let sortOption = {};
            if (sort === "asc") {
                sortOption = { price: 1 };
            } else if (sort === "desc") {
                sortOption = { price: -1 };
            }

            // Pasar el sortOption dentro de las opciones de paginación
            options.sort = sortOption;

            let query;
            if (categories === undefined) {
                query = {};
                const arrayProducts = await ProductModel.paginate(query, options);
                return arrayProducts;
            } else {
                query = { category: categories };
                const arrayProducts = await ProductModel.paginate(query, options);
                return arrayProducts;
            }
        } catch (error) {
            console.log("Error al obtener productos", error);
            throw new Error("Error al obtener productos", error);
        }
    }
    // // get Products on database by id
    async getProductsById(id) {
        try {
            const productById = await ProductModel.findById(id);
            return productById;
        } catch (error) {
            console.log("Error, Producto no encontrado", error);
            throw new Error("Error, Producto no encontrado");
        }
    }

  
    async deleteProducts(id){
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id) 
            
            return console.log("Deleted product", deletedProduct);
            
        } catch (error) {
            throw new Error("Error delete product")
        }
    }

    async updateProduct(id, productUpdate) {
        try {
            const productUpdated = await ProductModel.findByIdAndUpdate(
                id, 
                productUpdate, 
                { new: true } // Este opción retorna el documento actualizado
            );
            
            return productUpdated;
        } catch (error) {
            throw new Error("Error al actualizar el producto: " + error.message);
        }
    }
}

export default ProductManager;

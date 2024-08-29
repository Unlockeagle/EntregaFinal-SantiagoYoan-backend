import { Router } from "express";
import ProductManager from "../controller/productManager.js";
const router = Router();
const manager = new ProductManager();

// Create Products
router.post("/api/products", async (req, res) => {
    try {
        const newProduct = req.body;
        await manager.createProduct(newProduct);

        res.status(201).json({
            status: "success",
            data: newProduct,
        })
    } catch (error) {
        console.error("Error en el router:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// get Products on database
router.get("/api/products", async (req, res) => {
    try {
        const categories = req.query.category;
        const sort = req.query.sort;
        //sort: asc/desc

        const limit = parseInt(req.query.limit, 10) || 10;
        const page = parseInt(req.query.page, 10) || 1;
        const options = {
            limit: limit,
            page: page,
        };
        const arrayProducts = await manager.getProducts(options, categories, sort);

        const prevLink = arrayProducts.hasPrevPage
            ? `/api/products?page=${arrayProducts.prevPage}&limit=${limit}${categories ? `&category=${categories}` : ""}${
                  sort ? `&sort=${sort}` : ""
              }`
            : null;
        const nextLink = arrayProducts.hasNextPage
            ? `/api/products?page=${arrayProducts.nextPage}&limit=${limit}${categories ? `&category=${categories}` : ""}${
                  sort ? `&sort=${sort}` : ""
              }`
            : null;

        //Enviar la respuesta con status, datos y enlaces de paginación
        res.status(200).json({
            status: "success",
            data: arrayProducts,
            prevLink: prevLink,
            nextLink: nextLink,
        });
     
    } catch (error) {
        console.error("Error en el router:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// get Products on database By Id
router.get("/api/products/details/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const productById = await manager.getProductsById(id);
        res.status(200).send({ status: "succes", message: productById });
    } catch (error) {
        console.error("Error en el router:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Delete product
router.delete("/api/products/delete/:id", async (req, res) => {
    try {
        const id = req.params.id
        const deletedProduct = await manager.deleteProducts(id)
        res.status(201).json({status: "succes", message: `Deleted product${deletedProduct}`})
    } catch (error) {
        console.error("Error en el router:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
})

// Update product
router.put('/api/products/update/:id', async (req, res) => {
    const id = req.params.id;
    const productUpdate = req.body;
    console.log(id + productUpdate);
    

    try {
        const updatedProduct = await manager.updateProduct(id, productUpdate);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router;

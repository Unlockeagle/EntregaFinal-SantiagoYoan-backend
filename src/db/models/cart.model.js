import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

const CartModel = mongoose.model("cart", cartSchema);

export default CartModel;

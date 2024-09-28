import jwt from "jsonwebtoken";


const private_key = "coderhouse";

const generateToken = (user) => {
    const token = jwt.sign(user, private_key, { expiresIn: "24h" });
    return token;
};
export default generateToken;


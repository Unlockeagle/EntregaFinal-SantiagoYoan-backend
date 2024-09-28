import bcrypt from "bcrypt";

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const isValidPassword = (password, user) => {
    return bcrypt.compareSync(password, user.password);
};

export { createHash, isValidPassword };

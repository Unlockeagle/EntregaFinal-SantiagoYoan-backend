import { Router } from "express";
const router = Router();
import UserModel from "../db/models/user.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import generateToken from "../utils/jsonwebtoken.js";
import passport from "passport";

//#region PassportAuth
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password, imgUrl } = req.body;

    try {
        // Verificamos si existe el usuario
        const existeUsuario = await UserModel.findOne({ email });

        if (existeUsuario) {
            return res.status(201).send({ message: "Error Email ya esta en uso" });
        }
        // Si no existe el email se crea el nuevo usuario
        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            imgUrl,
        });

        // Se almacena en la DB el usuario nuevo
        await newUser.save();

        //req.session.user = true;
        // res.status(200).send({ message: "Nuevo usuario creado" });

        // Generar el token
        const token = generateToken({
            email: newUser.email,
        });

        // creamos la cookie
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true,
        });
        res.redirect("/api/sessions/current");
    } catch (error) {
        res.status(500).send({ messsage: "Error al crear usuario en el servidor" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Verificamos si el usuario esta registrado
        const usuarioBuscado = await UserModel.findOne({ email });

        if (!usuarioBuscado) {
            return res.status(400).send({ message: "Email no existe" });
        } else {
            // Verificamos la contraseña
            if (!isValidPassword(password, usuarioBuscado)) {
                return res.status(401).send({ message: "Contraseña no valida" });
            } else {
                //req.session.user == true;
                //res.status(200).send({ messsage: "Login Exitoso", user });

                // Generar el token
                const token = generateToken({ 
                    email: usuarioBuscado.email, 
                    first_name: usuarioBuscado.first_name,
                    last_name: usuarioBuscado.last_name,
                    age: usuarioBuscado.age,
                    role: usuarioBuscado.role,
                    imgUrl: usuarioBuscado.imgUrl
                });

                // creamos la cookie
                res.cookie("coderCookieToken", token, {
                    maxAge: 3600000,
                    httpOnly: true,
                });
                res.redirect("/api/sessions/current");
            }
        }
    } catch (error) {
        res.status(500).send({ messsage: "Error al hacer login de usuario en el servidor" });
    }
});

router.get("/current", passport.authenticate("current", { session: false }), async (req, res) => {
    // el objeto user ya viene desde la estrategia  
    res.render("profile", { user: req.user });
});

// router.get("/logout", async (req, res) => {
//     // lipiamos la cooki

//     res.clearCookie("coderCookieToken");
//     return res.redirect("/login");
// });


//#region GoogleAuth
/// Login con GoogleAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }), 
// async (req, res) => {
//     // no lleva nada porque googlo hace la estrategia
// }
);

// Google callback
router.get("/googlecallback", passport.authenticate("google", { failureRedirect: "/login" }), async  (req, res) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    // cargamos el usuario
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
});

router.post('/logout', (req, res, next) => {
    // Limpiamos la cookie
    res.clearCookie("coderCookieToken");
    // logout sugerido por la doc de passport-google
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });

export default router;

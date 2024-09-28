import passport from "passport";
import jwt from "passport-jwt";
//import UserModel from "../db/models/user.model.js";

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use(
        "current",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: "coderhouse",
            },
            async (jwt_payload, done) => {
                try {
                    //const user = await UserModel.findOne({jwt_payload.id})
                    return done(null, jwt_payload);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
    // passport.serializeUser((user, done) => {
    //     done(null, user._id);
    // });
    // passport.deserializeUser(async (id, done) => {
    //     let user = await UserModel.findById({ _id: id });
    //     done(null, user);
    // });
};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
};

export default initializePassport;

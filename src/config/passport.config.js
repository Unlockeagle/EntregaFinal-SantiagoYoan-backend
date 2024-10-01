import passport from "passport";
import jwt from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../db/models/user.model.js";
import configObject from "./config.js";

//
const { clientId, clientSecret, callbackUrl } = configObject

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
                    return done(null, jwt_payload);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id });
        done(null, user);
    });

    // Strategia con google
    passport.use(
        "google",
        new GoogleStrategy(
            {
                clientID: clientId,
                clientSecret: clientSecret,
                callbackURL: callbackUrl,
            },
            async (accessToken, refreshToken, profile, done) => {
                //cb
                try {
                    const email = profile._json.email;
                    if (!email) {
                        return done(new Error("Email not available from Google profile"), null);
                    }
                    const user = await UserModel.findOne({ email });
                    if (!user) {
                        // Si no encuentra el user lo registra
                        const newUser = {
                            first_name: profile._json.given_name,
                            last_name: profile._json.family_name,
                            age: 37,
                            email: profile._json.email,
                            password: "",
                            //avatar: profile._json.picture,
                            imgUrl: profile._json.picture,
                        };
                        const result = await UserModel.create(newUser);
                        done(null, result);
                    } else {
                        // si encuentra el user
                        done(null, user);
                    }
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
};

export default initializePassport;

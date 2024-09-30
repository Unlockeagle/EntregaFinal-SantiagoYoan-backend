import passport from "passport";
import jwt from "passport-jwt";
import GoogleStrategy from "passport-google-oauth20";
import UserModel from "../db/models/user.model.js";

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;
const GoogleAuthStrategy = GoogleStrategy.Strategy;

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
        new GoogleAuthStrategy(
            {
                clientID: "765684939203-rnt6hhrphhde40k3ug70q283tlbh0l83.apps.googleusercontent.com",
                clientSecret: "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",
                callbackURL: "http://localhost:8080/api/sessions/googlecallback",
            },
            async (accessToken, refreshToken, profile, done) => {
                //cb
                console.log(profile);
                try {
                    const email = profile._json.email;
                    if (!email) {
                        return done(new Error("Email not available from Google profile"), null);
                    }
                    const user = await UserModel.findOne({ email});
                    if (!user) {
                        // Si no encuentra el user lo registra
                        const newUser = {
                            first_name: profile._json.given_name,
                            last_name: profile._json.family_name,
                            age: 37,
                            email: profile._json.email,
                            password: "",
                            avatar: profile._json.picture,
                            // url: profile._json.html_url,
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

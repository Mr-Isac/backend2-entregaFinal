import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import UsersService from "../services/users.service.js";

const usersService = new UsersService();

const initializePassport = function () {

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
      },
      async function (jwtPayload, done) {
        try {

          const user = await usersService.getById(
            jwtPayload.id
          );

          if (!user) {
            return done(null, false);
          }

          return done(null, user);

        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

export default initializePassport;
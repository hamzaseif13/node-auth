const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const UserModel = require("../model/User")
const config = require("../config");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.jwtSecret;


// verifying the token on secured routes 
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await UserModel.findById(jwt_payload.user._id)
        if (user) {
          return done(null, user)
        }
        return done(null, false)
      } catch (error) {
        console.error(error)
      }
    })
  );
};
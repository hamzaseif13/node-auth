const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/User');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const {jwtSecret} = require('../config')
// ...

passport.use(
    'signup',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback:true
      },
      async (req,email, password, done) => {
        try {
          const user = await UserModel.create({ email, password ,name:req.body.name });
          return done(null, user);
        } catch (error) {
          if(error.code==11000){
            done({message:"email already exists"});
          }
          else{
            done({message:"Something Went Wrong please Try again Later"});
          }
        }
      }
    )
  );


passport.use(
    'login',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
          const validate = await user.isValidPassword(password);
  
          if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
          }
          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
passport.use(
  new JWTstrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
)
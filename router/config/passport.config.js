const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const credUtil = require('../utils/crud.util');
const config = require('../config');
const log = require('./log.config');
const userModel = require('../models/user.model');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // Validate email and password and attach user data in req object
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, (email, password, done) => {
    credUtil.getOne(userModel.User, { email })
      .then((user) => {
        if (!user || !user.validatePassword(password)) {
          log.error('User validation failed');
          return done(null, false, { errors: { data: 'email or password' } });
        }
        return done(null, user);
      })
      .catch((err) => { done(null, false, { errors: err }); });
  }));

  // Confuguration to retrieve JWT token from header
  const options = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
  };

  // Validate JWT token and retrieve user data from token
  passport.use(new JwtStrategy(options, (jwtPayload, done) => {
    if (jwtPayload.email) {
      return done(null, jwtPayload);
    }
    log.error('Not able to retrieve user data from token');
    return done(null, false, { errors: { 'email or password': 'is invalid' } });
  }));
};

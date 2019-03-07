const JwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  const options = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
  };

  passport.use(new JwtStrategy(options, (jwtPayload, done) => {
    if (jwtPayload.email) {
      return done(null, jwtPayload);
    }
    return done(null, false, { errors: { 'email or password': 'is invalid' } });
  }));
};

const express = require("express");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");

const UserDao = require("./dao/user.dao");
const config = require("./config");

var jwtStrategyOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecretKey,
  authScheme: "Bearer",
  issuer: config.domain
  // opts.audience : 'yoursite.net';
};

const jwtStrategy = new JwtStrategy(jwtStrategyOpts, async (jwt_payload, done) => {
  try {
    const user = await UserDao.findOne({ _id: mongoose.Types.ObjectId(jwt_payload.userId) });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

function setup(enableSecurity = true) {
  const app = express();
  if (enableSecurity) {
    passport.use(jwtStrategy);
    app.use(passport.initialize());
    app.use(passport.authenticate("jwt", { session: false }));
  }
  if (config.httpOptions.enableCompression) app.use(compression());
  app.use(helmet());

  return app;
}

module.exports = setup;

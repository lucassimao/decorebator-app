const express = require("express");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");

const UserDao = require("./dao/user.dao");
const config = require("./config");
const routers = require("./routers");

var jwtStrategyOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecretKey,
  authScheme: "Bearer",
  issuer: config.domain
  // opts.audience : 'yoursite.net';
};

const jwtStrategy = new JwtStrategy(
  jwtStrategyOpts,
  async (jwt_payload, done) => {
    try {
      const user = await UserDao.findOne({
        _id: mongoose.Types.ObjectId(jwt_payload.userId)
      });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // window size: 5 minutes
  max: 100 // 100 requests per windowMs
});

const app = express();

app.set("trust proxy", 1);
app.use(cors({ exposedHeaders: ["link"] }));

passport.use(jwtStrategy);
app.use(passport.initialize());
app.use(passport.authenticate("jwt", { session: false }));

if (!process.env.IGNORE_REQUEST_LIMIT) {
  app.use(limiter);
}
if (config.httpOptions.enableCompression) {
  app.use(compression());
}

app.use(config.isDev ? morgan("dev", { immediate: true }) : morgan("combined"));
app.use(helmet());
app.use("/", routers);

module.exports = app;

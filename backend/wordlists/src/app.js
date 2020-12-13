const express = require("express");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");
const userService = require("./services/user.service").default;
const routers = require("./routers");
const logger = require("./logger").default;

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("JTW_SECRET_KEY not found");
}

var jwtStrategyOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
  authScheme: "Bearer",
  issuer: "auth.decorebator.com",
  // audience: "decorebator.com"
};

const jwtStrategy = new JwtStrategy(
  jwtStrategyOpts,
  async (jwt_payload, done) => {
    try {
      const user = await userService.getById(parseInt(jwt_payload.userId));
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
  logger.info("Applying request limiter ...");
  app.use(limiter);
}
if (process.env.ENABLE_COMPRESSION) {
  logger.info("Enabling http compression ...");
  app.use(compression());
}

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev", { immediate: true }));
}
app.use(helmet());
app.use("/", routers);

module.exports = app;

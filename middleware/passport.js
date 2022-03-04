const passport = require("koa-passport");
const OAuth2Strategy = require("passport-oauth2").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config();
const axios = require("axios");
const { saveToken } = require("../config/redis");
const { verifyToken } = require("../config/jwt")

const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

passport.use(
  "local",
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username: username }).select("-__v -createdAt ");
      if (user === null) {
        return done(null, false);
      }

      if (!isValidPassword(user, password)) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      console.log(err);
      return done(err);
    }
  })
);

let adminAccessOptions = {};
adminAccessOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
adminAccessOptions.secretOrKey =
  process.env.ACCESS_TOKEN_SECRET ||
  "gaming_social";
passport.use("jwt-access-admin",
  new JwtStrategy(adminAccessOptions, function (jwt_payload, done) {
    User.findOne(
      { _id: jwt_payload.payload.user, role: "admin" },
      function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      }
    ).select("-__v -createdAt -password");
  })
);

let adminRefreshOptions = {};
adminRefreshOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
adminRefreshOptions.secretOrKey =
  process.env.REFRESH_TOKEN_SECRET ||
  "gaming_social";
passport.use("jwt-refresh-admin",
  new JwtStrategy(adminRefreshOptions, function (jwt_payload, done) {
    User.findOne(
      { _id: jwt_payload.payload.user, role: "admin" },
      function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      }
    ).select("-__v -createdAt -password");
  })
);

let userAccessOptions = {};
userAccessOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
userAccessOptions.secretOrKey =
  process.env.ACCESS_TOKEN_SECRET ||
  "gaming_social";
passport.use("jwt-access-user",
  new JwtStrategy(userAccessOptions, function (jwt_payload, done) {
    User.findOne(
      { _id: jwt_payload.payload.user },
      function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      }
    ).select("-__v -createdAt -password");
  })
);

let userRefreshOptions = {};
userRefreshOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
userRefreshOptions.secretOrKey =
  process.env.REFRESH_TOKEN_SECRET ||
  "gaming_social";
passport.use("jwt-refresh-user",
  new JwtStrategy(userRefreshOptions, function (jwt_payload, done) {
    User.findOne(
      { _id: jwt_payload.data, isAdmin: true },
      function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      }
    ).select("-__v -createdAt -password");
  })
);



passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user);
});

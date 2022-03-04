const Router = require("@koa/router");
const router = new Router();
const controller = require("../../../controllers/user/auth");
const passport = require("koa-passport");
require("../../../middleware/passport");
require("dotenv").config();

router.post(
  "/register",
  controller.registerUser
);

router.post(
  "/login",
  passport.authenticate("local", { failWithError: true }),
  controller.loginUser
);

router.post(
  "/info",
  passport.authenticate("jwt-access", { failWithError: true }),
  controller.getUserInfo
);

router.post(
  "/token",
  passport.authenticate("jwt-refresh", { failWithError: true }),
  controller.getNewAccessToken
);

module.exports = router.routes();

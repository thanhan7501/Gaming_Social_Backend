const Router = require("@koa/router");
const router = new Router();
const passport = require("koa-passport");
const controller = require("../../../controllers/admin/auth");
require("../../../middleware/passport");

router.post(
  "/login",
  passport.authenticate("local", { failWithError: true }),
  controller.loginAdmin
);
router.post(
  "/register",
  passport.authenticate("jwt-access", { failWithError: true }),
  controller.registerAdmin
);

router.post(
  "/info",
  passport.authenticate("jwt-access", { failWithError: true }),
  controller.getAdminInfo
);

router.post(
  "/token",
  passport.authenticate("jwt-refresh", { failWithError: true }),
  controller.getNewAccessToken
);

module.exports = router.routes();

const Router = require("@koa/router");
const router = new Router();
const authAdmin = require("./admin/auth");
const authUser = require("./user/auth");

//Admin api
router.use("/admin", authAdmin);

//User api
router.use("/user", authUser);

module.exports = router.routes();

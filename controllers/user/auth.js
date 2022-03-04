const User = require("../../models/user");
const {
  generateDataToken,
  verifyToken,
  generateToken,
  configJWT,
} = require("../../config/jwt");
const { saveToken, getToken } = require("../../config/redis");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  registerUser: async (ctx) => {
    let { username, email, password } = ctx.request.body;
    const existAccount = await User.findOne({
      username: username,
    });
    if (existAccount)
      ctx.body = {
        status: false,
        message: "Account existed",
      };
    else {
      let hash = bcrypt.hashSync(password, saltRounds);
      let user = new User({
        username: username,
        email: email,
        password: hash,
      });
      await user.save();
      ctx.body = {
        status: true,
        message: "Account created successfully",
      };
    }
  },

  loginUser: async (ctx) => {
    const user = ctx.state.user;
    payload = {
      _id: user._id,
      role: user.role,
    };
    const token = await generateDataToken(payload);

    await saveToken(token.accessToken, token.refreshToken, user._id);
    await ctx.login(user);
    return (ctx.body = {
      status: true,
      message: "Login successfully",
      data: {
        user_id: user._id,
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
        expired_time: token.expiredTime,
      },
    });
  },

  getUserInfo: async (ctx) => {
    const user = ctx.state.user;
    return (ctx.body = {
      status: true,
      user,
    });
  },

  getNewAccessToken: async (ctx) => {
    const user = ctx.state.user;
    const token = await generateDataToken(user._id);

    return (ctx.body = {
      status: true,
      message: "Get new token success",
      data: {
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
        expired_time: token.expiredTime,
      },
    });
  },
};

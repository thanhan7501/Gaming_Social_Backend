const redis = require("redis");

const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || "6379",
  username: process.env.REDIS_USERNAME || "",
  password: process.env.REDIS_PASSWORD || "",
  accessTokenRedisLife: 60 * 60, // 1 hours
  refreshTokenRedisLife: 7 * 24 * 60 * 60, // 7 days
  forgotTokenRedisLife: 30 * 60, // 30min
};

const redisClient = redis.createClient(
  redisConfig.port,
  redisConfig.host,
  redisConfig.username,
  redisConfig.password
);

redisClient.connect();

redisClient
  .on("connect", function () {
    console.log("Connected to redis client.");
  })
  .on("error", function (error) {
    console.log(error);
  });

const saveToken = async (accessToken, refreshToken, userId) => {
  await Promise.all([
    redisClient.set(`${userId} accessToken`, accessToken),
    redisClient.expire(
      `${userId} AccessToken`,
      redisConfig.accessTokenRedisLife
    ),
    redisClient.set(`${userId} refreshToken`, refreshToken),
    redisClient.expire(
      `${userId} RefreshToken`,
      redisConfig.refreshTokenRedisLife
    ),
  ]);
};

const getToken = async (userId) => {
  const accessToken = await redisClient.get(`${userId} accessToken`);
  const refreshToken = await redisClient.get(`${userId} refreshToken`);
  const token = { accessToken, refreshToken };
  return token;
};

module.exports = { saveToken, getToken };

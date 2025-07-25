const { JWT_SECRET = "some-secret-key" } = process.env;

module.exports = {
  JWT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
};
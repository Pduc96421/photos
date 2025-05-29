const userRoutes = require("./user.route");
const photoRoutes = require("./photo.route");
const commentRoutes = require("./comment.route");

const middlewareAuth = require("../../../middleware/auth.middleware");

module.exports = (app) => {
  const version = "/api/v1";

  app.use(version + "/users", userRoutes);

  app.use(version + "/photos", middlewareAuth.verifyToken, photoRoutes);

  app.use(version + "/comments", middlewareAuth.verifyToken, commentRoutes);
};

const userRoutes = require("./user.route");
const photoRoutes = require("./photo.route");
const commentRoutes = require("./comment.route");

module.exports = (app) => {
  const version = "/api/v1";

  app.use(version + "/users", userRoutes);

  app.use(version + "/photos", photoRoutes);

  app.use(version + "/comments", commentRoutes);
};

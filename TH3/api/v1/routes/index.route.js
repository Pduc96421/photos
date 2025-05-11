const userRoutes = require("./user.route");
const photoRoutes = require("./photo.route");

module.exports = (app) => {

  const version = "/api/v1";
  
  app.use(version + "/photos", userRoutes);
  
  app.use(version + "/users", photoRoutes);

}

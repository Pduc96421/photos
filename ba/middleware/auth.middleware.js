const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];

  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ code: 401, message: "Không có token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ code: 403, message: "Token không hợp lệ" });
    req.user = user;
    next();
  });
};

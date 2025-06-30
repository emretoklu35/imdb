const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Header'dan token'ı al
  const token = req.header("x-auth-token");

  // Token yoksa
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "mysecretjwtkey");
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

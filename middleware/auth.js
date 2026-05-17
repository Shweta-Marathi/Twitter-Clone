const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const header = req.header("Authorization");

    if (!header) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    // 🔥 FIX: remove "Bearer "
    const token = header.split(" ")[1];

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
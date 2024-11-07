const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    console.log("errorss", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { verifyToken };

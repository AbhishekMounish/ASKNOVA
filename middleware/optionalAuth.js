import jwt from "jsonwebtoken";

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRECT
    );

    req.user = decoded;

    next();
  } catch (e) {
    req.user = null;
    next();
  }
};

export default optionalAuth;
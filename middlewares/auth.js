import jwt from "jsonwebtoken";

export const authMiddleware =  async (req, res, next) => {
  try {
    let token;
    token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed",
          success: false,
        });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  } catch (err) {
    return res.status(401).json({
      message: "Auth failed",
      success: false,
    });
  }
};

import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      //   return res.status(401).json({ message: "Unauthorized" });
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    const isCustomAuth = token.length < 500;

    const decodedData = isCustomAuth
      ? jwt.verify(token, process.env.JWT_SECRET_KEY)
      : jwt.decode(token);

    req.userId = decodedData?.id || decodedData?.sub;

    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

export default auth;

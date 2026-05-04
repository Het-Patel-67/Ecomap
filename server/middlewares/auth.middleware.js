import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log("TOKEN:", token);
    if (!token) {
      throw new ApiError(401, "Not authorized");
    }
    
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    req.user = await User.findById(decoded.id).select("-password");
  
    next();
  } catch (error) {
    console.error("PROTECT ERROR:", error);
    next(error);
  }
};
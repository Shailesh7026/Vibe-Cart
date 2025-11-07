import { generatePublicId } from "./idGenerator.js";

export const assignCartToken = (req, res, next) => {
  let cartToken = req.cookies.cartToken;
  if (!cartToken) {
    cartToken = generatePublicId("tmpcrt");
    res.cookie("cartToken", cartToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
  req.cartToken = cartToken;
  next();
};
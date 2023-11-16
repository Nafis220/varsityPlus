const jwt = require("jsonwebtoken");

const checkRole = (req, res, next) => {
  const cookie =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookie) {
    const token = cookie[process.env.COOKIE_NAME];

    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    if (userInfo.role != "admin") {
      res
        .status(401)
        .json({
          error: {
            user: { message: "unauthorized, this page is only for admin" },
          },
        });
    } else {
      next();
    }
  } else {
    res
      .status(401)
      .json({
        error: { user: { message: "unauthorized, you need to login first" } },
      });
  }
};
module.exports = checkRole;

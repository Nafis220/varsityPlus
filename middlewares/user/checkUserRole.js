const jwt = require("jsonwebtoken");

const checkRole = (task) => {
  const checkRoleOperation = (req, res, next) => {
    const cookie =
      Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    if (cookie) {
      const token = cookie[process.env.COOKIE_NAME];

      const userInfo = jwt.verify(token, process.env.JWT_SECRET);
      if (userInfo.role === "admin") {
        next();
      } else if (
        userInfo.role === "admin" ||
        (userInfo.role === "moderator" && task === "moderatorTask")
      ) {
        next();
      } else {
        res.status(401).json({
          error: {
            user: { message: "unauthorized, this page is only for admin" },
          },
        });
      }
    } else {
      res.status(401).json({
        error: { user: { message: "unauthorized, you need to login first" } },
      });
    }
  };
  return checkRoleOperation;
};
module.exports = checkRole;

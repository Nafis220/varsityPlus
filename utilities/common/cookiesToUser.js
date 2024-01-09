const jwt = require("jsonwebtoken");

const cookiesToUser = (cookie) => {
  const resCookie = cookie;
  const token = resCookie[process.env.COOKIE_NAME];
  const userInfo = jwt.verify(token, process.env.JWT_SECRET);

  return userInfo;
};
module.exports = cookiesToUser;

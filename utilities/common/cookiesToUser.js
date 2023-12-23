const jwt = require("jsonwebtoken");

const cookiesToUser = (cookie) => {
  const resCookie = cookie;
  const token = resCookie[process.env.COOKIE_NAME];
  const userInfo = jwt.verify(token, process.env.JWT_SECRET);
  console.log(userInfo, " from cookies");
  return userInfo;
};
module.exports = cookiesToUser;

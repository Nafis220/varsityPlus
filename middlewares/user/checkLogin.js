const checkLogin = (req, res, next) => {
  const cookie =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  if (cookie) {
    next();
  } else {
    res
      .status(401)
      .json({ error: { user: { message: "Unauthorized login first" } } });
  }
};
module.exports = checkLogin;

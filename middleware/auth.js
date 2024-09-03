const jwt = require('jsonwebtoken');

const config = process.env;

// This middleware checks if a token is till valid WOW
const verifyToken = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['authorization'];

  if (!token) {
    res.status(403).send('A token is required for auth');
  }

  try {
    // token comes in form: Bearer iuwenfiuwnefoiuwegiwbreogbwiuegbwi(token) so to remove Bearer keyword and the space we are using the regular expression
    token = token.replace(/^Bearer\s+/, '');

    const decoded = jwt.verify(token, config.TOKEN_KEY);

    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }

  // if this is returned then it means that the middleware ran successfully and we can continue with whatevers next in the place where this middleware was called
  return next();
};

module.exports = verifyToken;

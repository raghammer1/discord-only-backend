const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postRegister = async (req, res) => {
  // res.send('register route');
  try {
    const { username, password, mail } = req.body;

    // check if user exists
    const userExists = await User.exists({ mail: mail.toLowerCase() });

    if (userExists) {
      return res.status(409).send('Email already in use');
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create user documnet and save in the db
    const user = await User.create({
      username,
      mail: mail.toLowerCase(),
      password: encryptedPassword,
    });

    //! create the jwt token so that user can be logged in and when token expires user is logged out
    const token = jwt.sign(
      {
        userId: user._id,
        mail,
      },
      process.env.TOKEN_KEY,
      { expiresIn: '24hr' }
    );

    return res.status(201).json({
      username: user.username,
      token,
      mail: user.mail,
      _id: user._id,
    });
  } catch (err) {
    return res.status(500).send('error occurred please try again');
  }
};

module.exports = postRegister;

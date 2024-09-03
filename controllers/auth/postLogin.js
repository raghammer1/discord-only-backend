const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postLogin = async (req, res) => {
  try {
    const { mail, password } = req.body;
    const user = await User.findOne({
      mail: mail.toLowerCase(),
    });

    // keeping given password first and password from db second is extremely important
    if (user && (await bcrypt.compare(password, user.password))) {
      // send token
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
    }
    res.status(400).send('Invalid Credential');
  } catch (err) {
    res.status(500).send('Invalid Credential');
  }
};

module.exports = postLogin;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authControllers');
const joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const registerSchema = joi.object({
  username: joi.string().min(3).max(12).required(),
  password: joi.string().min(6).max(12).required(),
  mail: joi.string().email().required(),
});

const loginSchema = joi.object({
  password: joi.string().min(6).max(12).required(),
  mail: joi.string().email().required(),
});

// Above are two validator schemas to make sure the data we get fulfills our requirements

// Checking the validator on route if the validator fails the post request will never be executed
router
  .route('/register')
  .post(validator.body(registerSchema), authController.controllers.postRegister)
  .get((req, res) => {
    res.send('register me');
  });

router.post(
  '/login',
  validator.body(loginSchema),
  authController.controllers.postLogin
);

// TEST ROUTE to test our middlewares
const auth = require('../middleware/auth');
router.route('/test').get(auth, (req, res) => {
  res.send('request Passes');
});

module.exports = router;

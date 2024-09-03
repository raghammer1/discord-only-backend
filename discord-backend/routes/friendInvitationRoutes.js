const express = require('express');
const router = express.Router();
const joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const auth = require('../middleware/auth');
const friendInvitationControllers = require('../controllers/friendInvitationControllers/friendInvitationControllers');

const postFriendInvitationSchema = joi.object({
  targetMailAddress: joi.string().email(),
});

// VALIDOR.BODY IS TO CHECK THAT THE GIVEN DATA IS SAME AS REQUIRED
// BY THE SCHEMA IF IT IS THEN IT WILL BE PROCESSED IN OUT CONTROLLER
// WHICH IS THE POSTINVITE IN THE FRIENDSINVITATIONCONTROLLERS FILE
// AUTH IS A MIDDLEWARE TO VERIFY THAT THE USER HAS A VALID JWT TOKEN
router.post(
  '/invite',
  auth,
  validator.body(postFriendInvitationSchema),
  friendInvitationControllers.controllers.postInvite
);

const inviteDecisionSchema = joi.object({
  id: joi.string().required(),
});

router.post(
  '/accept',
  auth,
  validator.body(inviteDecisionSchema),
  friendInvitationControllers.controllers.postAccept
);

router.post(
  '/reject',
  auth,
  validator.body(inviteDecisionSchema),
  friendInvitationControllers.controllers.postReject
);

module.exports = router;

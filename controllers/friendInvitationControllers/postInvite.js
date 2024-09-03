const User = require('../../models/user');
const FriendInvitation = require('../../models/friendInvitation');
const friendsUpdate = require('../../socketHandlers/updates/friends');

const postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;

  const { userId, mail } = req.user;

  // Check if friend is not same as us
  if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
    return res
      .status(500)
      .send('Sorry, you cannot become friend with yourself');
  }

  // Check target user exists
  const targetUser = await User.findOne({
    mail: targetMailAddress.toLowerCase(),
  });
  if (!targetUser) {
    return res
      .status(404)
      .send(`No user with email ${targetMailAddress} exists`);
  }

  // Check if invite has been already sent
  const invitationAlreadySent = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targetUser._id,
  });
  if (invitationAlreadySent) {
    return res.status(409).send('Invitation already sent');
  }

  // Check if taget user is already a friend
  const usersAlreadyFriends = targetUser.friends.find(
    (f) => f._id.toString() === userId.toString()
  );

  if (usersAlreadyFriends) {
    return res
      .status(409)
      .send('Friends already added please check your friends list');
  }

  // Now we can create a new invitation for a friend add
  const newInvitation = await FriendInvitation.create({
    senderId: userId,
    receiverId: targetUser._id,
  });

  // !if invite is successfully created then update friends invitation if other user is online

  // !Send the friend  request
  friendsUpdate.updateFriendsPendingInvitations(targetUser._id.toString());

  return res
    .status(201)
    .send(`Invitation sent successfully to ${targetUser.username}}`);
};

module.exports = postInvite;

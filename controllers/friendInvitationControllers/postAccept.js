const User = require('../../models/user');
const FriendInvitation = require('../../models/friendInvitation');
const friendsUpdate = require('../../socketHandlers/updates/friends');

const postAccept = async (req, res) => {
  try {
    const { id } = req.body;

    const inviteExists = (await FriendInvitation.exists({ _id: id })) !== null;
    const invitation = await FriendInvitation.findById(id);

    if (inviteExists) {
      await FriendInvitation.findByIdAndDelete(id);
    } else {
      return res.status(401).send('Error Occurred');
    }

    const { receiverId, senderId } = invitation;

    // add friend to both users
    const user1 = await User.findById(senderId);
    const user2 = await User.findById(receiverId);

    user1.friends = [...user1.friends, receiverId];
    user2.friends = [...user2.friends, senderId];

    await user1.save();
    await user2.save();

    // update list of friends live if users are online
    friendsUpdate.updateFriends(senderId.toString());
    friendsUpdate.updateOnlineFriends(senderId.toString());
    friendsUpdate.updateFriends(receiverId.toString());
    friendsUpdate.updateOnlineFriends(receiverId.toString());

    // delete the accepted invite from invitations
    friendsUpdate.updateFriendsPendingInvitations(receiverId.toString());
    return res.status(200).send('Invite successfully accepted');
  } catch (e) {
    console.log(e);
    return res.status(500).send('Something went wrong try again');
  }
  return res.send('REACHED ACCEPT');
};
module.exports = postAccept;

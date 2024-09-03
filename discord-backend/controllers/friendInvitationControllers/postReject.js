const User = require('../../models/user');
const FriendInvitation = require('../../models/friendInvitation');
const friendsUpdate = require('../../socketHandlers/updates/friends');

const postReject = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.user;

    // remove the invite from the friendInvitaitons collection
    const inviteExists = (await FriendInvitation.exists({ _id: id })) !== null;
    if (inviteExists) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    // update pending invitations
    friendsUpdate.updateFriendsPendingInvitations(userId);
    return res.status(200).send('Invite successfully rejected');
  } catch (e) {
    console.log(e);
    return res.status(500).send('Something went wrong try again');
  }
  return res.send('REACHED REJCET');
};
module.exports = postReject;

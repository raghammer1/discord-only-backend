const serverStore = require('../serverStore');
const friendsUpdate = require('./updates/friends');

const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user;

  serverStore.addNewConnectedUser({
    socketId: socket.id,
    userId: userDetails.userId,
  });

  // update pending friends invitations list
  friendsUpdate.updateFriendsPendingInvitations(userDetails.userId);

  // update friends list
  friendsUpdate.updateFriends(userDetails.userId);

  // update online users list
  friendsUpdate.updateOnlineFriends(userDetails.userId);

  // checking for online users every 8 seconds for live updates
  setInterval(() => {
    friendsUpdate.updateOnlineFriends(userDetails.userId);
  }, [10000]);
};

module.exports = newConnectionHandler;

const connectedUsers = new Map();

let io = null;

const setSocketServerInstance = (ioInstance) => {
  io = ioInstance;
};

const getSocketServerInstance = () => {
  return io;
};

const addNewConnectedUser = ({ socketId, userId }) => {
  connectedUsers.set(socketId, { userId });
  console.log('new connected users: ', connectedUsers);
};

const removeConnectedUser = (socketId) => {
  if (connectedUsers.has(socketId)) connectedUsers.delete(socketId);
  console.log('new connected users: ', connectedUsers);
};

// This can be multiple as the user can be logged into many devices at
// at a time and for each device there socketId will be different so we
// can get every live socketId like this
const getOnlineUsers = (userId) => {
  const activeConnections = [];
  connectedUsers.forEach((value, key) => {
    if (value.userId === userId) {
      activeConnections.push(key);
    }
  });
  return activeConnections;
};

const getAllOnlineUsers = () => {
  const onlineUsers = [];

  connectedUsers.forEach((value, key) => {
    onlineUsers.push(value.userId);
  });
  return onlineUsers;
};

module.exports = {
  addNewConnectedUser,
  removeConnectedUser,
  getSocketServerInstance,
  getOnlineUsers,
  setSocketServerInstance,
  getAllOnlineUsers,
};

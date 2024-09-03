const Message = require('../models/message');
const Conversation = require('../models/conversation');
const chatUpdates = require('./updates/chat');

const directChatHistoryHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverUserId } = data;
    console.log(
      'HERE333333333333333333333333333333333333333333',
      data,
      userId,
      receiverUserId
    );

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
    });

    console.log(conversation);

    if (conversation) {
      chatUpdates(conversation._id.toString(), socket.id);
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = directChatHistoryHandler;

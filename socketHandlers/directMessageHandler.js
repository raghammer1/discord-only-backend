const Message = require('../models/message');
const Conversation = require('../models/conversation');
const chatUpdates = require('./updates/chat');

const directMessageHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverUserId, content } = data;

    // create new message
    const message = await Message.create({
      content,
      author: userId,
      date: new Date(),
      type: 'DIRECT',
    });

    // find if conversation already exists between the two users
    const conversation = await Conversation.findOne({
      // This is being done so that it doesn't matter which value
      // in db is at the first place or second place it will look
      // for the object just one which has both regardless of the placing.
      participants: { $all: [userId, receiverUserId] },
    });

    if (conversation) {
      conversation.messages.push(message._id);
      await conversation.save();

      // perform and update to sender if is online
      chatUpdates(conversation._id.toString());
    } else {
      // create new convo if new one needs to be started
      const newConversation = await Conversation.create({
        messages: [message._id],
        participants: [userId, receiverUserId],
      });

      // perform and update to sender if is online
      chatUpdates(newConversation._id.toString());
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = directMessageHandler;

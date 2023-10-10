const gql = String.raw;
const { models } = require("../sequelize");
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

module.exports = {
  Query: {
    getAllChat: async () => {
      return models.Chat.findAll();
    },
    getChat: async (_, { ID }) => {
      const chat = models.Chat.findOne({ where: { id: ID } });
      console.log("chat=>", chat);
      return chat.datavalues;
    },
  },
  Mutation: {
    createChat: async (_, { chatInput: { chatMsg, messageBy } }) => {
      const newChat = await models.Chat.create({ chatMsg, messageBy });
      console.log("newchat", newChat);
      pubsub.publish("CHAT_CREATED", {
        chatcreated: {
          id: newChat.dataValues.id,
          chatMsg: chatMsg,
          messageBy: messageBy,
        },
      });
      return {
        id: newChat.dataValues.id,
        ...newChat.dataValues,
      };
    },
    groupChatting: async (
      _,
      { grpchatInput: { chatMsg, messageBy, name } }
    ) => {
      console.log("------------", chatMsg);
      const grpchat = await models.GrpChat.create({ chatMsg, messageBy, name });
      pubsub.publish("GRPCHAT_CREATED", {
        groupchat: {
          chatMsg: chatMsg,
          messageBy: messageBy,
          name: name,
        },
      });
      return {
        id: grpchat.dataValues.id,
        ...grpchat.dataValues,
      };
    },
  },
  Subscription: {
    chatcreated: {
      subscribe: async () => {
        return await pubsub.asyncIterator(["CHAT_CREATED"]);
      },
    },
    groupchat: {
      subscribe: async () => {
        return await pubsub.asyncIterator(["GRPCHAT_CREATED"]);
      },
    },
  },
};

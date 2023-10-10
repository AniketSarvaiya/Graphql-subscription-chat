const gql = String.raw;

module.exports = gql`
  type Chat {
    id: ID!
    chatMsg: String!
    messageBy: String!
  }
  type GrpChat {
    id: ID
    chatMsg: String!
    messageBy: String!
    name: String!
  }
  input GrpChatInput {
    chatMsg: String!
    messageBy: String!
    name: String!
  }
  input ChatInput {
    chatMsg: String!
    messageBy: String!
  }

  type Query {
    getAllChat: [Chat!]
    getChat(ID: ID!): Chat
  }

  type Mutation {
    createChat(chatInput: ChatInput!): Chat
    groupChatting(grpchatInput: GrpChatInput!): GrpChat
  }

  type Subscription {
    chatcreated: Chat!
    groupchat: GrpChat!
  }
`;

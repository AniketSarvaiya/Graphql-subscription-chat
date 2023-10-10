import { gql, useSubscription } from "@apollo/client";

export const MSG_SUB = gql`
  subscription ChatCreated {
    chatcreated {
      chatMsg
      messageBy
      id
    }
  }
`;

export const CREATE_MSG = gql`
  mutation Mutation($chatInput: ChatInput!) {
    createChat(chatInput: $chatInput) {
      chatMsg
      messageBy
    }
  }
`;

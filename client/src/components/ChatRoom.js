import { useMutation, useSubscription } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { MSG_SUB, CREATE_MSG } from "../Graphql/Queries";
import TextField from "@mui/material/TextField";
import { Box, Button, Container, Paper } from "@mui/material";

function ChatRoom() {
  const [name, setName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [msg, setMsg] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { data, loading, error } = useSubscription(MSG_SUB, {
    onSubscriptionData: (data) => {
      console.log(data.subscriptionData);
      console.log(data.subscriptionData.data.chatcreated);
      console.log("msg recived....");
      setMsg(data.subscriptionData.data.chatcreated);
      // setMessages([...messages, msg]);
    },
  });
  console.log("->>>>>>>>", messages);
  useEffect(() => {
    if (messages === null) setMessages([...messages]);
    else setMessages([...messages, msg]);
  }, [data]);
  const [
    createChat,
    {
      data: createChatdata,
      loading: createChatLoading,
      error: createChatError,
    },
  ] = useMutation(CREATE_MSG);

  useEffect(() => {
    console.log("error=>", createChatError);
  }, [createChatError]);

  const handlesubmit = () => {
    createChat({
      variables: {
        chatInput: {
          messageBy: name,
          chatMsg: message,
        },
      },
    });
    setMessage("");
  };
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  // window.setInterval(function () {
  //   var elem = document.getElementById("data");
  //   elem.scrollTop = elem.scrollHeight;
  // }, 5000);

  return (
    <div>
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          // width: "100vw",
        }}
      >
        <h1> Welcome to Chat room</h1>
        {!isJoined ? (
          <Box
            height={"1000px"}
            justifyContent={"center"}
            alignItems={"center"}
            display={"flex"}
          >
            {" "}
            <h2>Enter Your Name for Join</h2>
          </Box>
        ) : (
          <Box
            id="data"
            height={"90%"}
            width={"900"}
            display={"flex"}
            flexDirection={"column"}
            overflow={"scroll"}
          >
            {messages?.map((data) => {
              return (
                <Box fullWidth>
                  <p
                    style={{
                      float: name === data.messageBy ? "right" : "left",
                      backgroundColor:
                        name === data.messageBy ? "grey" : "#4dabf5",

                      padding: 10,
                      margin: 5,
                      borderRadius:
                        name === data.messageBy
                          ? "15px 15px 0px 15px"
                          : "15px 15px 15px 0px",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        textAlign: "left",
                      }}
                    >
                      {name !== data.messageBy && data.messageBy}
                      {name !== data.messageBy && <br />}
                    </span>
                    {data.chatMsg}
                  </p>
                  <br ref={scrollRef} />
                </Box>
              );
            })}
          </Box>
        )}
        <Box>
          <Paper
            style={{
              margin: 50,
              display: "flex",
            }}
          >
            {!isJoined ? (
              <>
                <TextField
                  fullWidth
                  label="Name"
                  id="fullWidth"
                  value={name}
                  style={{
                    marginRight: 30,
                  }}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    if (name === "") alert("Please Enter Name");
                    else setIsJoined(true);
                  }}
                >
                  Join
                </Button>
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="type message..."
                  id="message"
                  value={message}
                  style={{
                    marginRight: 30,
                  }}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
                <Button variant="contained" onClick={handlesubmit}>
                  Send
                </Button>
              </>
            )}
          </Paper>
        </Box>
      </Container>
    </div>
  );
}

export default ChatRoom;

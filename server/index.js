const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { createServer } = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");

require("dotenv").config();
const { useServer } = require("graphql-ws/lib/use/ws");

const typeDefs = require("./graphql/typeDef");
const resolvers = require("./graphql/resolver");

async function startServer() {
  const app = express();

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/grapgql",
  });
  const serverCleanup = useServer({ schema }, wsServer);
  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(express.json(), bodyParser.json(), cors());
  app.use("/grapgql", expressMiddleware(server));

  app.get("/", () => {
    console.log(`server running...`);
  });

  httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running  at port ${process.env.PORT}`);
  });
}
startServer();

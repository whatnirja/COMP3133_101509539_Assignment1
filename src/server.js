require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { getUserFromToken } = require("./middleware/auth");

async function start() {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization || "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
        const user = getUserFromToken(token);
        return { user };
      }
    })
  );

  const port = process.env.PORT || 8081;
  app.listen(port, () => console.log(`GraphQL running at http://localhost:${port}/graphql`));
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});


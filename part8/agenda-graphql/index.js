import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { GraphQLError } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Person from './models/person.js';
import User from './models/user.js';

dotenv.config();
const pubsub = new PubSub();
const app = express();
const httpServer = createServer(app);

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose.set('strictQuery', false);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const typeDefs = `
  enum YesNo {
    YES
    NO
  }
  type Address {
    street: String!
    city: String! 
  }
  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }
  type User {
    username: String!
    friends: [Person!]!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
    me: User
  }
  type Mutation {
    addPerson(name: String!, phone: String, street: String!, city: String!): Person
    editNumber(name: String!, phone: String!): Person
    createUser(username: String!): User
    login(username: String!, password: String!): Token
    addAsFriend(name: String!): User
  }
  type Subscription {
    personAdded: Person!
  }    
`;

const resolvers = {
  Query: {
    personCount: async () => await Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) {
        return await Person.find({});
      }
      return await Person.find({ phone: { $exists: args.phone === 'YES' } });
    },
    findPerson: async (root, args) => await Person.findOne({ name: args.name }),
    me: (root, args, context) => context.currentUser,
  },
  Person: {
    address: (root) => ({ street: root.street, city: root.city }),
  },
  Mutation: {
    addPerson: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      const person = new Person({ ...args });
      try {
        await person.save();
        context.currentUser.friends =
          context.currentUser.friends.concat(person);
        await context.currentUser.save();
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name, error },
        });
      }
      pubsub.publish('PERSON_ADDED', { personAdded: person });
      return person;
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name });
      if (!person) return null;
      person.phone = args.phone;
      try {
        await person.save();
      } catch (error) {
        throw new GraphQLError(error.message, { invalidArgs: args });
      }
      return person;
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username });
      return await user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name, error },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      const userForToken = { username: user.username, id: user._id };
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    addAsFriend: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      const person = await Person.findOne({ name: args.name });
      if (!currentUser.friends.some((f) => f._id.equals(person._id))) {
        currentUser.friends.push(person);
        await currentUser.save();
      }
      return currentUser;
    },
  },
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterableIterator(['PERSON_ADDED']),
    },
  },
};
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: '/',
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
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
app.use(
  '/',
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req.headers.authorization;

      if (auth) {
        const decodedToken = jwt.verify(
          auth.startsWith('Bearer ') ? auth.substring(7) : auth,
          process.env.JWT_SECRET
        );
        const currentUser = await User.findById(decodedToken.id).populate(
          'friends'
        );

        return { currentUser };
      }
    },
  })
);

httpServer.listen({ port: 4000 }, () =>
  console.log(`Server is now running on http://localhost:4000/`)
);

import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag';
import { GraphQLError } from 'graphql';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { PubSub } from 'graphql-subscriptions';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/book.js';
import Author from './models/author.js';
import User from './models/user.js';

dotenv.config();
const pubsub = new PubSub();
const app = express();
const httpServer = createServer(app);

mongoose.set('strictQuery', false);

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const typeDefs = gql`
  type Book {
    title: String
    published: Int
    author: Author!
    id: ID
    genres: [String]
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    books: [Book!]
    bookCount: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      id: ID
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
  type Subscription {
    bookAdded: Book!
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate('author');
      return books.filter((b) => {
        const matchesAuthor = args.author
          ? b.author.name === args.author
          : true;
        const matchesGenre = args.genre ? b.genres.includes(args.genre) : true;
        return matchesAuthor && matchesGenre;
      });
    },
    allAuthors: async () => await Author.find({}).populate('books'),
    me: (root, args, context) => context.currentUser,
  },
  Author: {
    bookCount: (author) => {
      return author.books ? author.books.length : 0;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      try {
        let author = await Author.findOne({ name: args.author });

        if (!author) {
          author = new Author({ name: args.author, books: [] });
          await author.save();
        }

        console.log('author antes', author);

        const book = new Book({ ...args, author: author._id });
        await book.save();

        author.books.push(book._id);
        await author.save();
        console.log("author despues ",author);

        return book;
      } catch (error) {
        throw new GraphQLError('Error saving book or author', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args, error },
        });
      }
    },
    editAuthor: async (root, args) => {
      try {
        return await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          { new: true }
        );
      } catch (error) {
        throw new GraphQLError('Updating author failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name, error },
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
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
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator(['BOOK_ADDED']),
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/',
});
const serverCleanup = useServer({ schema }, wsServer);
const server = new ApolloServer({
  schema,
  plugins: [
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

app.use(
  '/',
  express.json(),
  cors(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;

      if (auth) {
        const decodedToken = jwt.verify(
          auth.startsWith('Bearer ') ? auth.substring(7) : auth,
          process.env.JWT_SECRET
        );
        const currentUser = await User.findById(decodedToken.id);

        return { currentUser };
      }
    },
  })
);

httpServer.listen({ port: 4000 }, () =>
  console.log(`Server is now running on http://localhost:4000`)
);

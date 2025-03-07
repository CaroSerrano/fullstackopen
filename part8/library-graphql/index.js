const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { gql } = require('graphql-tag');
const { GraphQLError } = require('graphql');
const { v1: uuid } = require('uuid');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Book = require('./models/book');
const Author = require('./models/author');

require('dotenv').config();

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
    bookCount: Int
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
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
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      return await Book.find({}).populate('author');
    },
    allAuthors: async () => await Author.find({}),
  },
  // Author: {
  //   bookCount: (author) =>
  //     books.filter((book) => book.author === author.name).length,
  // },
  Mutation: {
    addBook: async (root, args) => {
      try {
        const author = await Author.findOneAndUpdate(
          { name: args.author },
          { name: args.author },
          { new: true, upsert: true }
        );

        const book = new Book({ ...args, author });

        await book.save();

        return book;
      } catch (error) {
        throw new GraphQLError('Error saving book or author', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error,
          },
        });
      }
    },

    // editAuthor: (root, args) => {
    //   const author = authors.find((a) => a.name === args.name);
    //   if (!author) {
    //     return null;
    //   }
    //   const updatedAuthor = { ...author, born: args.setBornTo };
    //   authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a));
    //   return updatedAuthor;
    // },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

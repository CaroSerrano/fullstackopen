import { gql } from '@apollo/client';

export const GET_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`;

export const GET_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`;

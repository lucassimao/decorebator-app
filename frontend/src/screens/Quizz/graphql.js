import { gql } from '@apollo/client';

export const SAVE_QUIZZ_RESULT = gql`
  mutation SaveQuizzResult($quizzId: ID!, $success: Boolean!) {
    saveQuizzGuess(quizzId: $quizzId, success: $success)
  }
`;

export const NEXT_QUIZZ_QUERY = gql`
  query GetNextQuizz($input: QuizzInput) {
    nextQuizz(input: $input) {
      id
      type
      text
      rightOptionIdx
      options{
      	... on Lemma{
          name
        }
        ... on Sentence{
          text
        }
      }
      word{
        name
        lexicalCategory
        id
      }
    }    
  }
`;
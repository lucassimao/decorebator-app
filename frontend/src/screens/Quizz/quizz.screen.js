import { gql, useLazyQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { HIDE_PROGRESS_MODAL, SHOW_PROGRESS_MODAL } from "../../redux/deprecated/progressModal";
import { SET_ERROR_SNACKBAR, CLEAR_SNACKBAR } from "../../redux/deprecated/snackbar";
import { useStyles } from "./quizz.styles";
import { Container, IconButton, Typography, Card, CardActionArea, CardContent } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";

const SAVE_QUIZZ_RESULT = gql`
  mutation SaveQuizzResult($quizzId: ID!, $success: Boolean!) {
    saveQuizzGuess(quizzId: $quizzId, success: $success)
  }
`;

const NEXT_QUERY = gql`
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

export const QuizzScreen = () => {
  const classes = useStyles();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [clickedOptionIdx, setClickedOptionIdx] = useState();

  const [saveQuizzResult] = useMutation(SAVE_QUIZZ_RESULT);

  const [fetchNextQuery, { called, loading, data }] = useLazyQuery(NEXT_QUERY, {
    fetchPolicy: 'network-only',
    variables: { input: { wordlistId: id } }
  });

  useEffect(() => {
    if (loading) {
      dispatch({ type: SHOW_PROGRESS_MODAL })
    } else {
      dispatch({ type: HIDE_PROGRESS_MODAL })
    }
  }, [loading, dispatch])

  useEffect(() => {
    fetchNextQuery();
    // eslint-disable-next-line
  }, [])

  if (loading || !called) {
    return null;
  }

  const onClickOption = (quizzId, clickedOptionIdx, isCorrect) => {
    setClickedOptionIdx(clickedOptionIdx)
    if (!isCorrect) {
      dispatch({ type: SET_ERROR_SNACKBAR, message: 'Wrong option' })
    }
    const interval = isCorrect ? 500 : 800;
    setTimeout(() => {
      fetchNextQuery()
      setClickedOptionIdx(null)
      dispatch({ type: CLEAR_SNACKBAR })
    }, interval);
    saveQuizzResult({ variables: { quizzId, success: isCorrect } })
  }

  let title

  if (data?.nextQuizz) {
    const { type, word, text } = data.nextQuizz;
    switch (type) {
      case 'SYNONYM':
        title = `Synonym for ${word.name} (${word.lexicalCategory}):`
        break;
      case 'WORD_FROM_MEANING':
        title = `${text} (${word.lexicalCategory}):`;
        break;
      case 'MEANING_FROM_WORD':
        title = `Meaning of ${word.name} (${word.lexicalCategory}):`;
        break;
      default:
        throw new Error(`unexpected type: ${type}`)
    }
  }


  return (
    <Container>

      <header className={classes.header}>
        <IconButton component={RouterLink} to='/' size="medium" color="primary"
          style={{ position: "absolute", top: -5, left: 0, fontWeight: "bold" }}>
          <ArrowBack />
        </IconButton>

        <Typography variant="h5" style={{ fontWeight: "bold" }} align="center">
          Quizz
        </Typography>
      </header>

      <main className={classes.main}>
        <Card raised={true} className={classes.card}>
          <CardActionArea>
            <CardContent>

              {!data?.nextQuizz ? <Typography gutterBottom variant="h6">Still processing this wordlist, try another one please</Typography> : (
                <>
                  <Typography gutterBottom variant="h6">
                    {title}
                  </Typography>

                  <ul>
                    {data.nextQuizz.options.map((option, idx) => {
                      const optionText = option.__typename === 'Lemma' ? option.name : option.text;
                      const showResult = (idx === clickedOptionIdx);
                      const isCorrect = (idx === data.nextQuizz.rightOptionIdx);
                      const cssClasses = [classes.quizzItem]
                      if (showResult) {
                        cssClasses.push(isCorrect ? classes.quizzItemCorrect : classes.quizzItemWrong)
                      }
                      return <li onClick={() => onClickOption(data.nextQuizz.id, idx, isCorrect)}
                        className={cssClasses.join(' ')} key={`${optionText}-${idx}`}>{optionText}</li>
                    })}
                  </ul>
                </>

              )}

            </CardContent>
          </CardActionArea>
        </Card>
      </main>
    </Container>
  )

}
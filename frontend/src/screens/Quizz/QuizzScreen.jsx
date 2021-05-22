import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import QueuePlayNextIcon from "@material-ui/icons/QueuePlayNext";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  HIDE_PROGRESS_MODAL,
  SHOW_PROGRESS_MODAL,
} from "../../redux/deprecated/progressModal";
import {
  CLEAR_SNACKBAR,
  SET_ERROR_SNACKBAR,
} from "../../redux/deprecated/snackbar";
import { NEXT_QUIZZ_QUERY, SAVE_QUIZZ_RESULT } from "./graphql";
import { useStyles } from "./quizz.styles";
import { QuizzHeader } from "./QuizzHeader";
import { QuizzTitle } from "./QuizzTitle";

export const QuizzScreen = () => {
  const classes = useStyles();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [clickedOptionIdx, setClickedOptionIdx] = useState(null);
  const [isNextQuizzButtonVisible, setNextQuizzButtonVisible] = useState(false);

  const [selectedQuizzTypes, setSelectedQuizzTypes] = useState({
    SYNONYM: true,
    WORD_FROM_MEANING: true,
    MEANING_FROM_WORD: true,
    FILL_SENTENCE: true,
    FILL_NEWS_SENTENCE: true,
    WORD_FROM_AUDIO: true,
  });

  const [saveQuizzResult] = useMutation(SAVE_QUIZZ_RESULT);

  const [fetchNextQuery, { called, loading, data, error }] = useLazyQuery(
    NEXT_QUIZZ_QUERY,
    {
      fetchPolicy: "network-only",
      variables: {
        input: {
          wordlistId: id,
          types: Object.entries(selectedQuizzTypes)
            .filter(([_, value]) => value)
            .map(([key]) => key),
        },
      },
    }
  );

  useEffect(() => {
    if (loading) {
      dispatch({ type: SHOW_PROGRESS_MODAL, message: "Loading" });
    } else {
      dispatch({ type: HIDE_PROGRESS_MODAL });
    }
  }, [loading, dispatch]);

  useEffect(() => {
    fetchNextQuery();
    // eslint-disable-next-line
  }, []);

  if (loading || !called) {
    return null;
  }

  const onClickOption = (event) => {
    if (event.target.tagName !== "LI") {
      return;
    }
    const quizzId = data.nextQuizz.id;
    const clickedOptionIdx = parseInt(event.target.dataset.index);
    const isCorrect = clickedOptionIdx === data.nextQuizz.rightOptionIdx;

    setClickedOptionIdx(clickedOptionIdx);
    if (isCorrect) {
      setTimeout(() => {
        fetchNextQuery();
        setClickedOptionIdx(null);
        dispatch({ type: CLEAR_SNACKBAR });
      }, 500);
    } else {
      dispatch({ type: SET_ERROR_SNACKBAR, message: "Wrong option" });
      setNextQuizzButtonVisible(true);
    }

    saveQuizzResult({ variables: { quizzId, success: isCorrect } });
  };

  const onClickNextQuizz = () => {
    fetchNextQuery();
    setClickedOptionIdx(null);
    dispatch({ type: CLEAR_SNACKBAR });
    setNextQuizzButtonVisible(false);
  };

  return (
    <Container>
      <QuizzHeader
        onChangeQuizTypeSelection={setSelectedQuizzTypes}
        quizzTypeSelection={selectedQuizzTypes}
      />

      <main className={classes.main}>
        <Card raised={true} className={classes.card}>
          <CardActionArea>
            <CardContent>
              {error && (
                <Typography gutterBottom variant="h6">
                  {error.message}
                </Typography>
              )}

              {data && (
                <>
                  <QuizzTitle quizz={data.nextQuizz} />

                  {data.nextQuizz.audioFile && (
                    <audio
                      controls
                      autobuffer="true"
                      preload="auto"
                      src={data.nextQuizz.audioFile}
                    />
                  )}

                  <ul onClick={onClickOption}>
                    {data.nextQuizz.options.map((option, idx) => {
                      const optionText =
                        option.__typename === "Lemma"
                          ? option.name
                          : option.text;
                      const key = `${optionText}-${idx}`;
                      const hasUserClicked = clickedOptionIdx !== null;
                      const { rightOptionIdx } = data.nextQuizz;

                      return (
                        <li
                          data-index={idx}
                          className={clsx(
                            classes.quizzItem,
                            hasUserClicked
                              ? {
                                  [classes.quizzItemCorrect]:
                                    idx === rightOptionIdx,
                                  [classes.quizzItemWrong]:
                                    idx === clickedOptionIdx,
                                }
                              : null
                          )}
                          key={key}
                        >
                          {optionText}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </CardContent>
          </CardActionArea>

          {isNextQuizzButtonVisible && (
            <CardActions disableSpacing>
              <Grid container direction="row" justify="flex-end">
                <Button size="small" color="primary" onClick={onClickNextQuizz}>
                  <QueuePlayNextIcon style={{ marginRight: "10px" }} /> Next
                  Quizz
                </Button>
              </Grid>
            </CardActions>
          )}
        </Card>
      </main>
    </Container>
  );
};

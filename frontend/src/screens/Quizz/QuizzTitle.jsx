import { Typography } from "@material-ui/core";
import Proptypes from "prop-types";
import React, { useEffect, useState } from "react";

const getIndexNthWords = (count, begin, text) => {
  if (count < 0) {
    let start = begin;
    let wordsBefore = 0;
    while (wordsBefore < Math.abs(count) && start > 0) {
      if (text[start - 1] === " ") {
        ++wordsBefore;
      }
      --start;
    }
    return start;
  }

  let end = begin;
  let wordsAfter = 0;
  while (wordsAfter < count && end < text.length) {
    if (text[end + 1] === " ") {
      ++wordsAfter;
    }
    ++end;
  }
  return end;
};

export const QuizzTitle = ({ quizz }) => {
  const [titleStart, setTitleStart] = useState(0);
  const [titleEnd, setTitleEnd] = useState();
  const [title, setTitle] = useState("");

  useEffect(() => {
    const { type, word, text, options, rightOptionIdx } = quizz;
    let newTitle = "";

    switch (type) {
      case "WORD_FROM_AUDIO":
        newTitle = `Select the word you hear:`;
        break;
      case "SYNONYM":
        newTitle = `Related or synonym for ${word.lemma.name} (${word.lemma.lexicalCategory}):`;
        break;
      case "WORD_FROM_MEANING":
        newTitle = `${text} (${word.lemma.lexicalCategory}):`;
        break;
      case "MEANING_FROM_WORD":
        newTitle = `Meaning of ${word.lemma.name} (${word.lemma.lexicalCategory}):`;
        break;
      case "FILL_NEWS_SENTENCE":
      case "FILL_SENTENCE": {
        const target = options[rightOptionIdx].text;
        const placeholder = [...Array(target.length)].map((_) => "_").join("");

        setTitleStart(getIndexNthWords(-10, text.indexOf(target) - 2, text));
        setTitleEnd(
          getIndexNthWords(10, text.indexOf(target) + target.length, text)
        );

        newTitle = text.replace(target, placeholder);
        if (type === "FILL_SENTENCE")
          newTitle += ` (${word.lemma.lexicalCategory}):`;
        else newTitle += ": ";
        break;
      }
      default:
        throw new Error(`unexpected type: ${type}`);
    }

    setTitle(newTitle);
  }, [quizz, setTitle]);

  return (
    <Typography gutterBottom variant="h6">
      {titleStart > 0 ? (
        <span
          onClick={() =>
            setTitleStart(getIndexNthWords(-5, titleStart, quizz.text))
          }
        >
          ...
        </span>
      ) : null}
      {title.slice(titleStart, titleEnd)}
      {titleEnd < quizz.text?.length ? (
        <span
          onClick={() => setTitleEnd(getIndexNthWords(5, titleEnd, quizz.text))}
        >
          ...
        </span>
      ) : null}
    </Typography>
  );
};

QuizzTitle.propTypes = {
  quizz: Proptypes.object.isRequired,
};

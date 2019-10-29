import React from "react";
import useForm from "react-hook-form";
import { Container } from "@material-ui/core";

function WordlistForm(props) {
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="wordlistName"> Name</label>
        <input id="wordlistName"></input>
      </form>
    </Container>
  );
}

export default WordlistForm;

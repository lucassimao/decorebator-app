import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, {useState} from "react";
import useForm from "react-hook-form";
import { Link } from "react-router-dom";
import AppBreadcrumb from "../common/AppBreadcrumb";

const useStyles = makeStyles(theme => ({
  form: {
    padding: theme.spacing(0, 2),
    height: "100%",
    display: "flex",
    flexFlow: "column",
    justifyContent: "space-between",
    color: theme.palette.grey[500],
    "& label": {
      fontWeight: "bold"
    }
  },
  gridButtons: {
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(1),
    "& > :first-child": {
      marginRight: theme.spacing(1)
    }
  }
}));

const HomeLink = React.forwardRef((props, ref) => <Link to="/" innerRef={ref} {...props} />);
const URL_REGEXP = new RegExp("^https://www.youtube.com/watch/*");

function FormYoutube() {
  const { register, handleSubmit, errors } = useForm({ mode: "onBlur" });
  const [ minWordLength, setMinWordLength ] = useState(3);
  const classes = useStyles();

  const onSubmit = data => {
    console.log(JSON.stringify(data));
  };

  const onSliderChange = (evt, value) =>{
    setMinWordLength(value);
  }

  return (
    <form noValidate className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AppBreadcrumb />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="dense"
            fullWidth
            autoComplete="off"
            autoFocus
            error={Boolean(errors.url)}
            helperText={errors.url && errors.url.message}
            name="url"
            inputRef={register({
              required: "Url field is required",
              pattern: {
                value: URL_REGEXP,
                message: "Incorrect youtube url"
              }
            })}
            label="Youtube video url"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography id="discrete-slider" gutterBottom>
            Minimum word length
          </Typography>
          <Slider
            step={1}
            marks
            value={minWordLength}
            onChange={onSliderChange}
            inputRef={register}
            min={1}
            max={10}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                name="onlyNewWords"
                inputRef={register}
              />
            }
            label="Only new words"
          />
        </Grid>
      </Grid>

      <Grid className={classes.gridButtons} container justify="flex-end">
        <Button component={HomeLink} variant="contained">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </Grid>
    </form>
  );
}

export default FormYoutube;

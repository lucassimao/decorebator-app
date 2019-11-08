import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React from "react";
import { Link } from "react-router-dom";
import useForm from "react-hook-form";
import AppBreadcrumb from "../common/AppBreadcrumb";
import { makeStyles } from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

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
  const classes = useStyles();

  const onSubmit = data => {
    console.log(data);
  };

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
            defaultValue={3}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={15}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                // checked={state.checkedB}
                // onChange={handleChange("checkedB")}
                value="checkedB"
                color="primary"
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

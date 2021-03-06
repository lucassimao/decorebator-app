import Snackbar from "@material-ui/core/Snackbar";
import PropTypes from "proptypes";
import React, { useState } from "react";
import { connect } from "react-redux";
import { CLEAR_SNACKBAR } from "../../redux/deprecated/snackbar";
import SnackbarContentWrapper from "./SnackBarContentWrapper";

function AppSnackbar(props) {
  const { message, variant, clearSnackbar } = props;
  const [anchorOrigin] = useState({ vertical: "bottom", horizontal: "center" });

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      open={true}
      autoHideDuration={3000}
      onClose={clearSnackbar}
    >
      <SnackbarContentWrapper
        onClose={clearSnackbar}
        variant={variant}
        message={message}
      />
    </Snackbar>
  );
}

const mapDispatchToProps = (dispatch) => ({
  clearSnackbar: () => dispatch({ type: CLEAR_SNACKBAR }),
});

AppSnackbar.propTypes = {
  variant: PropTypes.string,
  message: PropTypes.string,
  clearSnackbar: PropTypes.func,
};

export const SuccessSnackbar = connect(
  () => ({ variant: "success" }),
  mapDispatchToProps
)(AppSnackbar);
export const ErrorSnackbar = connect(
  () => ({ variant: "error" }),
  mapDispatchToProps
)(AppSnackbar);

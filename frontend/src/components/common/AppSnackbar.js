import Snackbar from '@material-ui/core/Snackbar';
import React, { useState } from "react";
import { connect } from 'react-redux';
import { CLEAR_SNACKBAR } from "../../reducers/snackbar";
import SnackbarContentWrapper from './SnackBarContentWrapper';


function AppSnackbar(props) {
  const { message, variant, clearSnackbar } = props
  const [anchorOrigin,] = useState({ vertical: 'bottom', horizontal: 'center' });

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      open={true}
      autoHideDuration={5000}
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
  clearSnackbar: () => dispatch({ type: CLEAR_SNACKBAR })
})

export const SuccessSnackbar = connect(() => ({ variant: 'success' }), mapDispatchToProps)(AppSnackbar)
export const ErrorSnackbar = connect(() => ({ variant: 'error' }), mapDispatchToProps)(AppSnackbar)


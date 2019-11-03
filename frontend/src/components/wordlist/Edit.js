import React, { useEffect, useState } from "react";
import { Container, Grid } from "@material-ui/core";
import AppBreadcrumb from "../common/AppBreadcrumb";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import service from "../../services/wordlist.service";
import { SHOW_PROGRESS_MODAL, HIDE_PROGRESS_MODAL } from "../../reducers/progressModal";

function Edit(props) {
  const {showProgressModal, hideProgressModal} = props;
  const [wordlist, setWordlist] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    showProgressModal('Loading ...');
    (async () => {
      const wordlist = await service.get(id);
      setWordlist(wordlist);
      hideProgressModal();
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AppBreadcrumb />
        </Grid>
        <Grid item xs={12}>{wordlist && JSON.stringify(wordlist)}</Grid>
      </Grid>
    </Container>
  );
}


const mapDispatchToProps = dispatch => ({
  showProgressModal: (title,description) => dispatch({type: SHOW_PROGRESS_MODAL, description, title}),
  hideProgressModal: () => dispatch({type: HIDE_PROGRESS_MODAL}),
});

export default connect(
  null,
  mapDispatchToProps
)(Edit);

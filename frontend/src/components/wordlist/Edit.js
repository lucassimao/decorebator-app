import { Grid, List, ListItem, makeStyles, TextField } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { HIDE_PROGRESS_MODAL, SHOW_PROGRESS_MODAL } from "../../reducers/progressModal";
import service from "../../services/wordlist.service";
import AppBreadcrumb from "../common/AppBreadcrumb";

const useSyles = makeStyles(theme => (
  {
    grid:{
      height: '100%',
      maxHeight: '100%',
      padding: theme.spacing(0,2)
    },
    icon: {
      padding: theme.spacing(.5)
    },
    gridItem:{
      flexBasis: 'auto',
      marginTop: theme.spacing(1),
      '&:first-of-type': {
        margin:0
      }
    }
  }
))

function Edit(props) {
  const { showProgressModal, hideProgressModal } = props;
  const [wordlist, setWordlist] = useState(null);
  const { id } = useParams();
  const classes = useSyles();

  // loading the wordlist with the ID
  useEffect(() => {
    showProgressModal('Loading ...');
    (async () => {
      try {
        const wordlist = await service.get(id);
        setWordlist(wordlist);
      } catch (error) {
        console.error(error);
      } finally {
        hideProgressModal();
      }

    })();
    // eslint-disable-next-line
  }, []);

  const onTextFieldKeyDown = async (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();

      showProgressModal('Wait', 'Adding new word ...');
      const name = event.target.value;
      event.target.value = '';
      const uri = await service.addWord(id, name);
      const _id = uri.substr(uri.lastIndexOf('/') + 1);
      wordlist.words.push({ name, _id });
      hideProgressModal();
    }
  }

  const deleteWord = async (id) => {
    showProgressModal('Wait', 'Deleting word ...');
    wordlist.words = wordlist.words.filter(word => word._id !== id);
    hideProgressModal();
  }

  return (
      <Grid  wrap="nowrap" direction="column"  className={classes.grid} container>
        <Grid className={classes.gridItem} item xs={12}>
          <AppBreadcrumb />
        </Grid>
        <Grid className={classes.gridItem}  item xs={12}>
          <TextField
            margin="dense"
            fullWidth
            autoComplete="off"
            autoFocus
            name="name"
            label="Add a new word or expression ..."
            onKeyDown={onTextFieldKeyDown}
            variant="outlined"
          />
        </Grid>
        <Grid className={classes.gridItem} item xs={12} style={{overflow:'scroll', flexGrow: 1}}>
          <List disablePadding>
            {wordlist && wordlist.words.map(word => (
              <ListItem key={word._id}>
                <ListItemText primary={word.name} />
                <IconButton onClick={() => deleteWord(word._id)} edge="end" className={classes.icon}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
  );
}


const mapDispatchToProps = dispatch => ({
  showProgressModal: (title, description) => dispatch({ type: SHOW_PROGRESS_MODAL, description, title }),
  hideProgressModal: () => dispatch({ type: HIDE_PROGRESS_MODAL }),
});

export default connect(
  null,
  mapDispatchToProps
)(Edit);

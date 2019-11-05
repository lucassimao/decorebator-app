import { Grid, List, ListItem, makeStyles, TextField, Typography } from "@material-ui/core";
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
      padding: theme.spacing(0,2,1,2)
    },
    icon: {
      padding: theme.spacing(.5)
    },
    gridItem:{
      flexBasis: 'auto',
      marginTop: theme.spacing(1),
      '&:first-of-type': {
        margin:0
      },
    },
    list:{
        backgroundColor: '#fff',

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
      const word = event.target.value;
      const itsEmpty = word && !word.trim();
      if (itsEmpty){
          return;
      }

      event.preventDefault();

      showProgressModal('Wait', 'Adding new word ...');
      event.target.value = '';
      const uri = await service.addWord(id, word);
      const _id = uri.substr(uri.lastIndexOf('/') + 1);
      wordlist.words.push({ name: word, _id });
      hideProgressModal();
    }
  }

  const deleteWord = async (id) => {
    showProgressModal('Wait', 'Deleting word ...');
    await service.deleteWord(wordlist._id, id);
    wordlist.words = wordlist.words.filter(word => word._id !== id);
    hideProgressModal();

  }

  return (
      <Grid  wrap="nowrap" direction="column"  className={classes.grid} container>
        <Grid className={classes.gridItem} item xs={12}>
          <AppBreadcrumb />
        </Grid>
        <Grid className={classes.gridItem} item xs={12}>
            <Typography variant="h6">{wordlist && wordlist.name}</Typography>
            <Typography variant="caption">{wordlist && wordlist.description}</Typography>

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
          <List disablePadding className={classes.list}>
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

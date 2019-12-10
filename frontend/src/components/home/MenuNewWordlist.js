import React, { useEffect } from "react";
import { Container, List, ListItem } from "@material-ui/core";

function MenuNewWordlist() {
  return (
    <Container>
      <Typography variant="h5" className={classes.sectionHeader}>
        Create a new wordlist
      </Typography>

      <List>
          <ListItem>
              From Youtube
          </ListItem>
      </List>
    </Container>
  );
}

export default MenuNewWordlist;

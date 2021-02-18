import React from "react";
import { Link } from "react-router-dom";

const MenuLink = React.forwardRef((props, ref) => (
  <Link to="/wordlists/menu" innerRef={ref} {...props} />
));
MenuLink.displayName = "MenuLink";

export default MenuLink;

import React from "react";
import {Fab, Zoom, useScrollTrigger, makeStyles} from "@material-ui/core";
import {KeyboardArrowUp} from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(3),
    right: theme.spacing(3)
  }
}));

function ScrollTop(props) {
  const { children } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

export default function BackToTopButton(props) {
  return (
    <ScrollTop {...props}>
      <Fab color="secondary" size="small" aria-label="scroll back to top">
        <KeyboardArrowUp />
      </Fab>
    </ScrollTop>
  );
}

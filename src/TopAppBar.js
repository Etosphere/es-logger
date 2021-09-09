import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";

function HideOnScroll(props) {
  const { children } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function TopAppBar(props) {
  return (
    <>
      <HideOnScroll {...props}>
        <AppBar style={{backgroundColor: "#f7d774", color: "#5f5f5f"}}>
        {/* <AppBar elevation={0} color="transparent"> */}
          <Toolbar>
            <Typography variant="h6">ES Logger</Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  );
}
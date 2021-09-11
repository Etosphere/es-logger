import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import IconButton from '@material-ui/core/IconButton';

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
  const darkModeIcon = props.useDarkMode ? <Brightness3Icon/> : <Brightness7Icon/>

  return (
    <>
      <HideOnScroll {...props}>
        {/*<AppBar style={{backgroundColor: "#f7d774"}}>*/}
         <AppBar elevation={0} color="transparent">
          <Toolbar style={{paddingLeft: '24px', paddingRight: '24px'}}>
            <Typography variant="h6" style={{flex: 1}}>ES Logger</Typography>
            <IconButton
              edge="end"
              aria-label="dark mode toggle icon"
              color="inherit"
              onClick={props.toggleDarkMode}>
              {darkModeIcon}
            </IconButton>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  );
}
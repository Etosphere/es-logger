import React, {Suspense} from 'react';
import createTheme from "@material-ui/core/styles/createTheme";
import {ThemeProvider} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import GitHubIcon from '@material-ui/icons/GitHub';
import TopAppBar from './TopAppBar';

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          height: "100%",
          minHeight: "100%",
          width: "100%",
          fontFamily: "-apple-system, 'Helvetica Neue', Helvetica ,Arial, 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif",
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        code: {
          fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
        },
        footer: {
          padding: "1.5em",
          marginTop: "auto",
          width: "100%",
          textAlign: "center"
        }
      }
    },
    Grid: {
      alignItems: "center",
      justifyContent: "center"
    },
    MuiDivider: {
      root: {
        margin: "12px"
      }
    }
  },
  palette: {
    primary: {
      main: "#717bd6",
    },
    secondary: {
      main: "#e8618c",
    },
  },
});

const LogParserComponent = React.lazy(() => import('./LogParser'));

const LoadingComponent = () => (
  <Backdrop open>
    <CircularProgress color="inherit" />
  </Backdrop>
);

const SuspenseComponent = () => (
  <Suspense fallback={LoadingComponent}>
    <Container maxWidth="md" style={{minHeight: "82vh", marginTop: '2em'}}>
      <LogParserComponent/>
    </Container>
  </Suspense>
)

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <TopAppBar/>
      <SuspenseComponent/>
      <footer id="footer" className="footer">
        <Link href="https://github.com/etosphere/es-logger" style={{color: "#907da2"}}>
          <GitHubIcon fontSize="small"/>
        </Link>
        <div style={{color: "#907da2"}}>©&nbsp;2021&nbsp;ES</div>
      </footer>
    </ThemeProvider>
  );
}

export default App;

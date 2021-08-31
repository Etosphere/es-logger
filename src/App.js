import {createTheme, ThemeProvider, CssBaseline, Container, Link} from "@material-ui/core";
import LogParser from './LogParser';
import {GitHub} from '@material-ui/icons';

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          height: '100%',
          minHeight: '100%',
          width: '100%',
          fontFamily: "-apple-system, 'Helvetica Neue', Helvetica ,Arial, 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif",
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        code: {
          fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
        },
        header: {
          textAlign: 'center',
          marginTop: '3em',
          marginBottom: '3em'
        },
        footer: {
          padding: '1.5em',
          marginTop: 'auto',
          width: '100%',
          textAlign: 'center'
        }
      }
    },
    Grid: {
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" style={{minHeight: '82vh'}}>
        <header>
          <h1>
            es-logger
          </h1>
          <h3>
            A simple logger for CoC.
          </h3>
        </header>
        <LogParser />
      </Container>
      <footer id="footer" className="footer">
        <Link href='https://github.com/etosphere/es-logger' style={{color: '#907da2'}}>
          <GitHub fontSize='small'/>
        </Link>
        <div style={{color: '#907da2'}}>©&nbsp;2021&nbsp;ES</div>
      </footer>
    </ThemeProvider>
  );
}

export default App;

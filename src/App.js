import {createTheme, ThemeProvider, CssBaseline, Container} from "@material-ui/core";
import LogParser from './LogParser';

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          height: '100%',
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
      <Container maxWidth="md" style={{marginBottom: '80px'}}>
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
    </ThemeProvider>
  );
}

export default App;

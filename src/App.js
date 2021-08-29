import {createTheme, ThemeProvider, CssBaseline, Container} from "@material-ui/core";
import '@fontsource/roboto';
import LogParser from './LogParser';

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          height: '100%',
          width: '100%',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        code: {
          fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
        },
        header: {
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
      <Container maxWidth="md">
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

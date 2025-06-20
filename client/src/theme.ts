import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5722', // deep orange
    },
    secondary: {
      main: '#4caf50', // green
    },
    background: {
      default: '#212121', // dark grey
    },
  },
});

export default theme;

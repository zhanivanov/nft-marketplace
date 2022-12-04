import { Box, Container, createTheme, CssBaseline, ThemeProvider, Typography } from '@mui/material';
import { Outlet } from "react-router-dom";
import { Header } from '../components/header';

const theme = createTheme();

export const Root = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <main>
        <Container sx={{ py: 8 }} maxWidth="xl">
          <Outlet />
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          NFT Marketplace Demo for LimeAcademy 2022
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Implemented on the last day of the assignment 😢😢😢
        </Typography>
        {/* <Copyright /> */}
      </Box>
      {/* End footer */}
    </ThemeProvider >
  );
};

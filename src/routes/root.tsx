import { Box, Container, createTheme, CssBaseline, ThemeProvider, Typography } from '@mui/material';
import { Outlet } from "react-router-dom";
import { Header } from '../components/header';
import { Provider, inject } from 'mobx-react';
import { useState } from 'react';
import { NFTStore } from '../store/nft.store';
import { MetamaskStore } from '../store/metamask.store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();

export const Root = inject('metamaskStore')(({ metamaskStore }: { metamaskStore?: MetamaskStore }) => {
  const [nftStore] = useState(new NFTStore(metamaskStore!))

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <main>
          <Container sx={{ py: 8 }} maxWidth="xl">
            <ToastContainer />
            <Provider nftStore={nftStore}>
              <Outlet />
            </Provider>
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
    </>
  );
});

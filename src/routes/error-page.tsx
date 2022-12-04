import { Box, Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error: any = useRouteError();
  console.error(error);

  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }}>
      <Typography variant="h1" align="center" gutterBottom>
        Oops!
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        component="p"
      >
        Sorry, an unexpected error has occurred. 😭
      </Typography>
      <Typography
        variant="subtitle2"
        align="center"
        color="text.secondary"
        component="p"
      >
        {error.statusText || error.message}
      </Typography>
    </Box>
  );
}
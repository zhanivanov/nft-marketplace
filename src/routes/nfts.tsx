import { Grid, Typography } from '@mui/material';
import { inject, observer } from 'mobx-react';
import { useEffect } from 'react';
import { CardComponent } from '../components/card';
import { NFTStore } from '../store/nft.store';

export const NFTS = inject('nftStore')(observer(({ nftStore }: { nftStore?: NFTStore }) => {
  useEffect(() => { nftStore!.loadUnsold() }, [nftStore]);

  return (
    <Grid container spacing={4}>
      {nftStore!.unsoldNfts.length > 0 ? nftStore!.unsoldNfts?.map((card) => (
        <Grid item key={card.image} xs={12} sm={6} md={4} lg={3}>
          <CardComponent data={card} onBuy={() => nftStore!.loadUnsold()} />
        </Grid>
      )) :
        <Typography gutterBottom variant="h5" component="h2">
          NFTs not uploaded yet
        </Typography>
      }
    </Grid>
  );
}));


import { Grid, Typography } from '@mui/material';
import { inject, observer } from 'mobx-react';
import { useEffect } from 'react';
import { CardComponent } from '../components/card';
import { NFTStore } from '../store/nft.store';

export const MyNFTS = inject('nftStore')(observer(({ nftStore }: { nftStore?: NFTStore }) => {
  useEffect(() => { nftStore!.loadOwned() }, [nftStore]);

  return (
    <Grid container spacing={4}>
      {nftStore!.ownedNfts.length > 0 ? nftStore!.ownedNfts?.map((card) => (
        <Grid item key={card.image} xs={12} sm={6} md={4} lg={3}>
          <CardComponent data={card} />
        </Grid>
      )) :
        <Typography gutterBottom variant="h5" component="h2">
          No owned NFTs
        </Typography>
      }
    </Grid>
  );
}));


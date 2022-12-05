import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MetamaskStore } from '../store/metamask.store';
import { NFTStore } from '../store/nft.store';

export const CardComponent = inject('metamaskStore', 'nftStore')(observer(({ data, onBuy, metamaskStore, nftStore }: { data: any, onBuy?: any, metamaskStore?: MetamaskStore, nftStore?: NFTStore }) => {
  const [imgSrc, setImgSrc] = useState("");
  useEffect(() => {
    nftStore!.getImage(data.image)
      .then(src => setImgSrc(src));
  }, []);

  const buyMarketplaceNft = async (token, price) => {
    const onSuccess = () => {
      toast.success("woo hoo ! you ow this NFT 🎉", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      redirect("my-nfts");
    }
    const onError = (error) => {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }


    try {
      const tx = await metamaskStore!.marketplaceContract.buyItem(token, { value: nftStore!.etherToWei(price), from: metamaskStore!.account })
      await tx.wait();
      onSuccess();
      onBuy();
    } catch (error: any) {
      onError(error.message);
    }
  }

  return (
    <Card
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardMedia
        component="img"
        image={imgSrc}
        alt="random"
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          #{data.token}
        </Typography>
        <Typography gutterBottom variant="h5" component="h2">
          {data.name}
        </Typography>
        <Typography>
          {data.desc}
        </Typography>
        <Typography>
          Price: {data.price}
        </Typography>
      </CardContent>
      <CardActions>
        {!!onBuy && <Button size="small" onClick={() => buyMarketplaceNft(data.token, data.price)}>Buy</Button>}
      </CardActions>
    </Card>
  );
}));


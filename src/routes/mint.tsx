import { Box, Button, ButtonGroup, Chip, Container, Stack, TextField } from "@mui/material";

import { inject, observer } from 'mobx-react';
import { useRef, useState } from "react";
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MetamaskStore } from "../store/metamask.store";
import { NFTStore } from "../store/nft.store";

export const Mint = inject('metamaskStore', 'nftStore')(observer(({ metamaskStore, nftStore }: { metamaskStore?: MetamaskStore, nftStore?: NFTStore }) => {
  const formRef = useRef<any>(null);
  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState<any>([]);
  const [loader, setLoader] = useState(false);

  const addAttribute = (e) => {
    e.preventDefault();
    if (attributes) {
      const attr = [
        ...attributes,
        {
          id: attributes.length,
          trait_type: e.target.key.value,
          value: e.target.value.value,
        },
      ];
      setAttributes(attr)
    } else {
      setAttributes([
        { id: 0, trait_type: e.target.key.value, value: e.target.value.value },
      ]);
    }
    formRef.current!.reset();
  };

  const removeAttribute = (id) => {
    var filteredAttr = attributes.filter((data) => data.id !== id);
    setAttributes(filteredAttr);
  };

  const uploadImageToIPFS = async () => {
    const { chainId } = await metamaskStore!.getNetwork()

    if (chainId.toString() !== process.env.REACT_APP_CHAIN_ID) {
      toast.error('Invalid chain Id ! Please use ropsten test network :)', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return
    }

    setLoader(true)
    if (!name || !description || !price || !file) {
      toast.error("Please fill all the required fields !", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };

    try {
      const added = await nftStore!.infuraClient.add(file)
      const url = `/ipfs/${added.path}`
      await uploadMetadataToIPFS(url)
    } catch (error) {
      setLoader(false)
      toast.error("Image upload failed !", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log('Error uploading file: ', error)
    }
  }

  const uploadMetadataToIPFS = async (fileUrl) => {
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name: name,
      description: description,
      image: fileUrl,
      attributes: attributes
    });
    try {
      const added = await nftStore!.infuraClient.add(data);
      const url = `/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      await mintNFT(url)

      return url;
    } catch (error) {
      setLoader(false)
      toast.error("Meta data upload failed !", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log("Error uploading file: ", error);
    }
  }

  const mintNFT = async (metadata) => {
    try {

      const tx = await metamaskStore!.marketplaceContract.sellItem(metadata, nftStore!.etherToWei(price), metamaskStore!.nftContract.address, { from: metamaskStore!.account, value: nftStore!.etherToWei("0.0001") })
      await tx.wait();

      setFile("")
      setName("")
      setPrice("")
      setDescription("")
      setAttributes([])

      window.location.assign("/profile")
      toast.success("NFT minted successfully 🎉", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoader(false)
    } catch (error: any) {
      setLoader(false)
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    }
  }

  return (
    <Container maxWidth="sm">
      <Stack spacing={2}>
        <TextField id="outlined-basic" label="NFT Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField id="outlined-basic" label="Price" variant="outlined" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Button variant="contained" component="label">
          Upload Image
          <input hidden accept="image/*" multiple type="file" onChange={(e: any) => setFile(e.target.files[0])} />
        </Button>
        <TextField
          id="outlined-multiline-static"
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Box
          sx={{
            '& .MuiTextField-root': { mr: 1 },
          }}
        >
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="Disabled elevation buttons"
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={(e) => addAttribute(e)}
            ref={formRef}
          >
            <TextField
              id="outlined-required"
              label="Key"
              name="key"
            />
            <TextField
              id="outlined-disabled"
              label="Value"
              name="value"
            />
            <Button variant="contained" type="submit">Add</Button>
          </ButtonGroup>
        </Box>
        <Stack direction="row" spacing={1}>
          {attributes.map((attr, i) => <Chip key={i} label={`${attr.trait_type}:${attr.value}`} onDelete={() => removeAttribute(attr.id)} />)}
        </Stack>
        <Button variant="contained" color="success" onClick={() => uploadImageToIPFS()} disabled={loader}>
          {loader ? "Minting..." : "Mint NFT"}
        </Button>
      </Stack>
    </Container>
  );
}));
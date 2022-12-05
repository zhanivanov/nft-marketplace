import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { makeAutoObservable } from "mobx";
import { MetamaskStore } from './metamask.store';

const authorization = 'Basic ' + Buffer.from(process.env.REACT_APP_INFURA_PROJECT + ':' + process.env.REACT_APP_INFURA_PROJECT_SECRET).toString('base64');

export class NFTStore {
  public unsoldNfts: any = [];
  public ownedNfts: any = [];
  public mintedNfts: any = [];
  public infuraClient: IPFSHTTPClient;

  constructor(private metamaskStore: MetamaskStore) {
    makeAutoObservable(this);
    this.infuraClient = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      apiPath: '/api/v0',
      headers: {
        authorization
      }
    });
  }

  public getUrl(url: string): string {
    const uri = url.split('https://ipfs.infura.io');
    return uri[1] || uri[0];
  }

  public async loadUnsold(): Promise<any> {
    const unsoldNft = await this.metamaskStore.marketplaceContract.fetchMarketItems();
    const formattedData = await Promise.all(unsoldNft.map(nft => this.formatNFTData(nft)))

    this.unsoldNfts = formattedData || [];
  }

  public async loadOwned(): Promise<any> {
    const ownedNfts = await this.metamaskStore.marketplaceContract.fetchOwnerItemsListed({ from: this.metamaskStore.account });
    const formattedData = await Promise.all(ownedNfts.map(nft => this.formatNFTData(nft)))

    this.ownedNfts = formattedData || [];
  }

  public async loadMinted(): Promise<any> {
    const mintedNfts = await this.metamaskStore.marketplaceContract.fetchCreatorItemsListed({ from: this.metamaskStore.account });
    const formattedData = await Promise.all(mintedNfts.map(nft => this.formatNFTData(nft)))

    this.mintedNfts = formattedData || [];
  }

  public async getImage(imageSrc: string) {
    const image: any = [];
    for await (const item of this.infuraClient.cat(this.getUrl(imageSrc))) {
      image.push(item);
    }

    const buf = Buffer.from(image[0]).toString('base64');

    return `data:image/png;base64, ${buf}`;
  }

  public async formatNFTData(data: any) {
    const tokenUri = await this.metamaskStore.nftContract.tokenURI(data.token)
    console.log('tokenUri', tokenUri)
    const content: any = [];
    for await (const item of this.infuraClient.cat(this.getUrl(tokenUri))) {
      content.push(item);
    }
    const raw = Buffer.from(content[0])?.toString('utf8')
    const meta = JSON.parse(raw);

    const formattedData = {
      name: meta.name,
      image: meta.image,
      desc: meta.description,
      price: this.weiToEther(data.price),
      token: (data.token).toString(),
      creator: data.creator,
      attributes: meta.attributes
    }

    return formattedData;
  }

  public weiToEther(num: number) {
    return ethers.utils.formatEther(num);
  }

  public etherToWei(n: string) {
    const weiBigNumber = ethers.utils.parseEther(n.toString());
    const wei = weiBigNumber.toString();

    return wei;
  }

}
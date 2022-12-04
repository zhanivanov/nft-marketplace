import { ethers } from 'ethers';
import { makeAutoObservable } from "mobx";
import NFTContract from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarketContract from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

declare const window: { ethereum: any }
const REQUEST_ACCOUNTS = 'eth_requestAccounts';

export class AppStore {
  constructor(private marketplaceContract: ethers.Contract, private nftContract: ethers.Contract) {
    makeAutoObservable(this);
  }
}
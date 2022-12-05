import { ethers } from 'ethers';
import { computed, makeAutoObservable, runInAction } from "mobx";
import NFTContract from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarketContract from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

declare const window: { ethereum: any, location: any }
const REQUEST_ACCOUNTS = 'eth_requestAccounts';

export class MetamaskStore {
  public account: string = '';
  public marketplaceContract: ethers.Contract;
  public nftContract: ethers.Contract;

  private provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum);

  constructor() {
    makeAutoObservable(this, {
      signer: computed
    });
    this.marketplaceContract = new ethers.Contract('', NFTMarketContract.abi, this.signer);
    this.nftContract = new ethers.Contract('', NFTContract.abi, this.signer);
    window.ethereum.on('accountsChanged', (accounts: any[]) => {
      this.setAccount(accounts);
      window.location.assign("/")
    });
  }

  public get signer(): ethers.providers.JsonRpcSigner {
    return this.provider.getSigner(this.account || undefined);
  }

  public async getNetwork(): Promise<ethers.providers.Network> {
    return this.provider.getNetwork();
  }

  public async init() {
    await this.checkIfConnected();
    await this.loadContracts();
  }

  public async connect(): Promise<void> {
    await this.provider.send(REQUEST_ACCOUNTS, []);
  }

  public setAccount(accounts: string[]) {
    if (accounts.length > 0) {
      this.account = accounts[0];
    } else {
      this.account = '';
    }
  }

  private async checkIfConnected(): Promise<void> {
    const accounts = await this.provider.listAccounts();
    this.setAccount(accounts);
  }

  private async loadContracts() {
    const { chainId } = await this.getNetwork();
    if (chainId.toString() !== process.env.REACT_APP_CHAIN_ID) {
      throw new Error("NETWORK ID MISMATCH");
    }

    runInAction(() => {
      this.marketplaceContract = new ethers.Contract(process.env.REACT_APP_NFT_MARKET_CONTRACT_ADDRESS || '', NFTMarketContract.abi, this.signer);
      this.nftContract = new ethers.Contract(process.env.REACT_APP_NFT_CONTRACT_ADDRESS || '', NFTContract.abi, this.signer);
    });
  }
}
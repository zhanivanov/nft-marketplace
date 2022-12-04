import { ethers } from 'ethers';
import { makeAutoObservable } from "mobx";
import NFTContract from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarketContract from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

declare const window: { ethereum: any }
const REQUEST_ACCOUNTS = 'eth_requestAccounts';

export class MetamaskStore {
  public account: string = '';
  public marketplaceContract: ethers.Contract | null = null;
  public nftContract: ethers.Contract | null = null;

  private provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  private signer: ethers.providers.JsonRpcSigner;

  constructor() {
    makeAutoObservable(this);
    this.signer = this.provider.getSigner();
    window.ethereum.on('accountsChanged', (accounts: any[]) => this.setAccount(accounts));
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
    const { chainId } = await this.provider.getNetwork()
    if (chainId.toString() !== process.env.CHAIN_ID) {
      this.marketplaceContract = null;
      this.nftContract = null;
    }

    const nftMarketplaceContract = new ethers.Contract(process.env.NFT_MARKET_CONTRACT_ADDRESS || '', NFTMarketContract.abi, this.signer);
    const nftContract = new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS || '', NFTContract.abi, this.signer);

    this.marketplaceContract = nftMarketplaceContract;
    this.nftContract = nftContract;
  }
}
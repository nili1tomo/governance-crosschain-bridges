export interface SymbolMap<T> {
  [symbol: string]: T;
}

export type eNetwork =
  | eEthereumNetwork
  | ePolygonNetwork
  | eXDaiNetwork
  | eArbitrumNetwork
  | eOptimismNetwork
  | eMantleNetwork;

export enum eEthereumNetwork {
  kovan = 'kovan',
  ropsten = 'ropsten',
  rinkeby = 'rinkeby',
  goerli = 'goerli',
  main = 'main',
  coverage = 'coverage',
  hardhat = 'hardhat',
  tenderlyMain = 'tenderlyMain',
}

export enum ePolygonNetwork {
  matic = 'matic',
  mumbai = 'mumbai',
}

export enum eXDaiNetwork {
  xdai = 'xdai',
}

export enum eArbitrumNetwork {
  arbitrum = 'arbitrum',
  arbitrumTestnet = 'arbitrum-testnet',
}

export enum eOptimismNetwork {
  main = 'optimism',
  testnet = 'optimism-testnet',
}

export enum eMantleNetwork {
  main = 'mantle',
  testnet = 'mantle-testnet',
}


export enum EthereumNetworkNames {
  kovan = 'kovan',
  ropsten = 'ropsten',
  rinkeby = 'rinkeby',
  goerli = 'goerli',
  main = 'main',
  matic = 'matic',
  mumbai = 'mumbai',
  xdai = 'xdai',
}

export type tEthereumAddress = string;

export type iParamsPerNetwork<T> =
  | iEthereumParamsPerNetwork<T>
  | iPolygonParamsPerNetwork<T>
  | iXDaiParamsPerNetwork<T>
  | iArbitrumParamsPerNetwork<T>
  | iOptimismParamsPerNetwork<T>
  | iMantleParamsPerNetwork<T>;

export interface iParamsPerNetworkAll<T>
  extends iEthereumParamsPerNetwork<T>,
    iPolygonParamsPerNetwork<T>,
    iXDaiParamsPerNetwork<T> {}

export interface iEthereumParamsPerNetwork<eNetwork> {
  [eEthereumNetwork.coverage]: eNetwork;
  [eEthereumNetwork.kovan]: eNetwork;
  [eEthereumNetwork.ropsten]: eNetwork;
  [eEthereumNetwork.rinkeby]: eNetwork;
  [eEthereumNetwork.goerli]: eNetwork;
  [eEthereumNetwork.main]: eNetwork;
  [eEthereumNetwork.hardhat]: eNetwork;
  [eEthereumNetwork.tenderlyMain]: eNetwork;
}

export interface iPolygonParamsPerNetwork<T> {
  [ePolygonNetwork.matic]: T;
  [ePolygonNetwork.mumbai]: T;
}

export interface iXDaiParamsPerNetwork<T> {
  [eXDaiNetwork.xdai]: T;
}

export interface iArbitrumParamsPerNetwork<T> {
  [eArbitrumNetwork.arbitrum]: T;
  [eArbitrumNetwork.arbitrumTestnet]: T;
}

export interface iOptimismParamsPerNetwork<T> {
  [eOptimismNetwork.main]: T;
  [eOptimismNetwork.testnet]: T;
}

export interface iMantleParamsPerNetwork<T> {
  [eMantleNetwork.main]: T;
  [eMantleNetwork.testnet]: T;
}


export interface ObjectString {
  [key: string]: string;
}

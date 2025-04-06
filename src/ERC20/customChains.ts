import { ChainId, networks } from "@0xsequence/network";
import type { Chain } from "viem/chains";
import { defineChain } from "viem/chains/utils";

export const homeverse = /*#__PURE__*/ defineChain({
  id: 19011,
  name: "Oasys Homeverse",
  nativeCurrency: {
    name: "Oasys",
    symbol: "OAS",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.mainnet.oasys.homeverse.games"],
    },
  },
  blockExplorers: {
    default: {
      name: "Oasys Homeverse Explorer",
      url: "https://explorer.oasys.homeverse.games",
      apiUrl: "https://explorer.oasys.homeverse.games/api",
    },
  },
  testnet: false,
}) as Chain;

export const homeverseTestnet = /*#__PURE__*/ defineChain({
  id: 40875,
  name: "Oasys Homeverse Testnet",
  nativeCurrency: {
    name: "Oasys",
    symbol: "OAS",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.oasys.homeverse.games"],
    },
  },
  blockExplorers: {
    default: {
      name: "Oasys Homeverse Testnet Explorer",
      url: "https://explorer.testnet.oasys.homeverse.games",
      apiUrl: "https://explorer.testnet.oasys.homeverse.games/api",
    },
  },
  testnet: true,
}) as Chain;

export const XAI = /*#__PURE__*/ defineChain({
  id: ChainId.XAI,
  name: String(networks[ChainId.XAI].title),
  nativeCurrency: {
    name: "Xai",
    symbol: "XAI",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://xai-chain.net/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: String(networks[ChainId.XAI].blockExplorer?.name),
      url: String(networks[ChainId.XAI].blockExplorer?.rootUrl),
    },
  },
  testnet: false,
}) as Chain;

export const XAI_SEPOLIA = /*#__PURE__*/ defineChain({
  id: ChainId.XAI_SEPOLIA,
  name: String(networks[ChainId.XAI_SEPOLIA].title),
  nativeCurrency: {
    name: "Xai",
    symbol: "XAI",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-v2.xai-chain.net/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: String(networks[ChainId.XAI_SEPOLIA].blockExplorer?.name),
      url: String(networks[ChainId.XAI_SEPOLIA].blockExplorer?.rootUrl),
    },
  },
  testnet: true,
}) as Chain;

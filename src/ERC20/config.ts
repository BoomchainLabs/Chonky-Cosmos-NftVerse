import {
  marketplaceApiURL,
  metadataURL,
  rpcNodeURL,
  sequenceApiURL,
  PLATFORM_FEE_RECIPIENT_AVALANCHE_OPTIMISM,
} from "./consts";
import { XAI, XAI_SEPOLIA, homeverse, homeverseTestnet } from "./customChains";
import { ChainId, indexerURL, networks } from "@0xsequence/network";
import {
  base,
  polygon,
  mainnet,
  arbitrum,
  optimism,
  bsc,
  avalanche,
  gnosis,
  polygonZkEvm,
  arbitrumSepolia,
  avalancheFuji,
  sepolia,
  polygonAmoy,
  arbitrumNova,
  astarZkEVM,
  astarZkyoto,
  type Chain,
  baseSepolia,
} from "viem/chains";

interface NetworkConfig {
  chainId: number;
  name: string;
  title: string;
  indexerUrl: string;
  metadataUrl: string;
  marketplaceApiUrl: string;
  sequenceApiUrl: string;
  // is this a test network
  isTestnet: boolean;
  // used with readonly multicall provider, so we can show on chain information even when user is not connected to the same network.
  // using https://nodes.sequence.app/* right now, can specify any compatible rpc node in network config
  readOnlyNodeURL: string;
  // block explorer URL
  explorerUrl: string;
  // block explorer name
  explorerName: string;

  viemChainConfig: Chain;

  customPlatformFeeRecipient?: string;
}

export const SUPPORTED_NETWORKS = [
  networkConfigFromViem({ name: "polygon", chain: polygon }),
  networkConfigFromViem({ name: "mainnet", chain: mainnet }),
  networkConfigFromViem({ name: "arbitrum", chain: arbitrum }),
  networkConfigFromViem({ name: "arbitrum-nova", chain: arbitrumNova }),
  networkConfigFromViem({
    name: "optimism",
    chain: optimism,
    options: {
      customPlatformFeeRecipient: PLATFORM_FEE_RECIPIENT_AVALANCHE_OPTIMISM,
    },
  }),
  networkConfigFromViem({ name: "binance", chain: bsc }),
  networkConfigFromViem({ name: "homeverse", chain: homeverse }),
  networkConfigFromViem({
    name: "avalanche",
    chain: avalanche,
    options: {
      customPlatformFeeRecipient: PLATFORM_FEE_RECIPIENT_AVALANCHE_OPTIMISM,
    },
  }),
  {
    chainId: ChainId.XAI,
    name: String(networks[ChainId.XAI].name),
    title: String(networks[ChainId.XAI].title),
    isDefault: false,
    isTestnet: false,
    indexerUrl: indexerURL("xai"),
    marketplaceApiUrl: marketplaceApiURL("xai"),
    sequenceApiUrl: sequenceApiURL,
    metadataUrl: metadataURL,
    readOnlyNodeURL: rpcNodeURL("xai"),
    explorerUrl: removeTrailingSlash(
      String(networks[ChainId.XAI].blockExplorer?.rootUrl),
    ),
    explorerName: String(networks[ChainId.XAI].blockExplorer?.name),
    viemChainConfig: XAI,
  },
  networkConfigFromViem({ name: "gnosis", chain: gnosis }),
  networkConfigFromViem({ name: "polygon-zkevm", chain: polygonZkEvm }),
  networkConfigFromViem({ name: "base", chain: base }),
  /* TESTNETS */
  networkConfigFromViem({ name: "amoy", chain: polygonAmoy }),
  networkConfigFromViem({ name: "sepolia", chain: sepolia }),
  networkConfigFromViem({ name: "arbitrum-sepolia", chain: arbitrumSepolia }),
  networkConfigFromViem({ name: "avalanche-testnet", chain: avalancheFuji }),
  networkConfigFromViem({ name: "base-sepolia", chain: baseSepolia }),
  networkConfigFromViem({ name: "homeverse-testnet", chain: homeverseTestnet }),
  networkConfigFromViem({ name: "astar-zkevm", chain: astarZkEVM }),
  networkConfigFromViem({ name: "astar-zkyoto", chain: astarZkyoto }),
  {
    chainId: ChainId.XAI_SEPOLIA,
    name: String(networks[ChainId.XAI_SEPOLIA].name),
    title: String(networks[ChainId.XAI_SEPOLIA].title),
    isDefault: false,
    isTestnet: true,
    indexerUrl: indexerURL("xai-sepolia"),
    marketplaceApiUrl: marketplaceApiURL("xai-sepolia"),
    sequenceApiUrl: sequenceApiURL,
    metadataUrl: metadataURL,
    readOnlyNodeURL: rpcNodeURL("xai-sepolia"),
    explorerUrl: removeTrailingSlash(
      String(networks[ChainId.XAI_SEPOLIA].blockExplorer?.rootUrl),
    ),
    explorerName: String(networks[ChainId.XAI_SEPOLIA].blockExplorer?.name),
    viemChainConfig: XAI_SEPOLIA,
  },
] satisfies NetworkConfig[];

function networkConfigFromViem({
  name,
  chain,
  options,
}: {
  name: string;
  chain: Chain;
  options?: Partial<NetworkConfig>;
}) {
  return {
    chainId: chain.id,
    //Sequence chain name
    name: name,
    //Human readable name
    title: chain.name,
    indexerUrl: indexerURL(name),
    metadataUrl: metadataURL,
    marketplaceApiUrl: marketplaceApiURL(name),
    sequenceApiUrl: sequenceApiURL,
    isDefault: false,
    isTestnet: chain.testnet ?? false,
    readOnlyNodeURL: rpcNodeURL(name),
    explorerUrl: chain.blockExplorers?.default.url ?? "",
    explorerName: chain.blockExplorers?.default.name ?? "",
    viemChainConfig: chain,
    ...options,
  };
}

function removeTrailingSlash(url: string) {
  return url.replace(/\/$/, "");
}

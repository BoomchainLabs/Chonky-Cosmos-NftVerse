import type { Chain } from "wagmi/chains";
import { salesConfigs } from "../salesConfigs";
import { getChainConfig } from "./primarySales/helpers";

const chains = Array.from(
  new Set(salesConfigs.map((item) => getChainConfig(item.chainId))),
) as [Chain, ...Chain[]];

export default chains;

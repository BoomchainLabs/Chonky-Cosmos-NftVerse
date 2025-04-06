import { Address, Chain } from "viem";
import { getDefaultChains } from "@0xsequence/kit";
import {
  defaultChainId,
  salesConfigs as salesConfigurations,
} from "../../salesConfigs";

export interface UnpackedSaleConfigurationProps {
  networkName: string;
  nftTokenAddress: Address;
  salesContractAddress: Address;
  chainId: number;
}

const unpackedSalesConfigurations = salesConfigurations.map((item) => {
  const { nftTokenAddress, salesContractAddress, chainId } = item;
  const chain = getChainConfig(chainId);
  return {
    networkName: chain.name,
    nftTokenAddress,
    salesContractAddress,
    chainId: chain.id,
  };
}) as UnpackedSaleConfigurationProps[];

const defaultSaleConfiguration = unpackedSalesConfigurations.find(
  (saleConfiguration) => saleConfiguration.chainId === defaultChainId,
);
if (!defaultSaleConfiguration)
  throw new Error(
    "SaleConfigurationNotFoundError: No sale configuration found for the specified chain ID",
  );

export function getSaleConfiguration(
  chainId: number | undefined,
): UnpackedSaleConfigurationProps {
  if (!defaultSaleConfiguration) {
    throw new Error(
      "SaleConfigurationNotFoundError: No default sale configuration found",
    );
  }

  return (
    unpackedSalesConfigurations.find(
      (saleConfiguration) => saleConfiguration.chainId === chainId,
    ) || defaultSaleConfiguration
  );
}

export const formatPriceWithDecimals = (
  price: bigint,
  tokenDecimals: number,
): string => {
  const divisor = BigInt(10 ** tokenDecimals);

  const integerPart = price / divisor;
  const decimalPart = price % divisor;

  let formattedDecimal = decimalPart.toString().padStart(tokenDecimals, "0");

  formattedDecimal = formattedDecimal.replace(/0+$/, "");

  return formattedDecimal
    ? `${integerPart.toString()}.${formattedDecimal}`
    : integerPart.toString();
};

export function getChainConfig(chainId: number): Chain {
  return getDefaultChains([chainId])[0];
}

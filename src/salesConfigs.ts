type SaleConfiguration = {
  nftTokenAddress: `0x${string}`;
  salesContractAddress: `0x${string}`;
  chainId: number;
};

export const salesConfigs: SaleConfiguration[] = [
  {
    nftTokenAddress: "0x70a2177079877e4aae639d1abb29ffa537b94970",
    salesContractAddress: "0xa55574c5ed4cd1dbc5feba47a204fdfb483edadd",
    chainId: 80002, //polygonAmoy
  },
];

// This value must match one of the chainIds present in your salesConfigurations.
export const defaultChainId = 80002; //polygonAmoy

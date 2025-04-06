import { SequenceIndexer } from "@0xsequence/indexer";
import { useQuery } from "@tanstack/react-query";

import { useMetadataClient } from "../hooks/useMetadataClient";
import { useIndexerClient } from "../hooks/useIndexerClient";

export const time = {
  oneSecond: 1 * 1000,
  oneMinute: 60 * 1000,
  oneHour: 60 * 60 * 1000,
};

export const useTokenMetadata = (
  chainId: number,
  contractAddress: string,
  tokenIds: string[],
) => {
  const metadataClient = useMetadataClient();

  const query = useQuery({
    queryKey: ["tokenMetadata", chainId, contractAddress, tokenIds],
    queryFn: async () => {
      const res = await metadataClient.getTokenMetadata({
        chainID: String(chainId),
        contractAddress,
        tokenIDs: tokenIds,
      });

      return res.tokenMetadata;
    },
    retry: true,
    staleTime: time.oneMinute * 10,
    enabled: !!chainId && !!contractAddress,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
};

export const useContractInfo = (
  chainId: number,
  contractAddress: string | undefined,
) => {
  const metadataClient = useMetadataClient();

  return useQuery({
    queryKey: ["contractInfo", chainId, contractAddress],
    queryFn: async () => {
      const res = await metadataClient.getContractInfo({
        chainID: String(chainId),
        contractAddress: contractAddress || "",
      });

      return res.contractInfo;
    },
    retry: true,
    staleTime: time.oneMinute * 10,
    enabled: !!chainId && !!contractAddress,
  });
};

interface UseCollectionBalanceArgs {
  chainId: number;
  accountAddress: string;
  contractAddress: string;
  includeMetadata?: boolean;
  verifiedOnly?: boolean;
}

export const getCollectionBalance = async (
  indexerClient: SequenceIndexer,
  args: UseCollectionBalanceArgs,
) => {
  const res = await indexerClient.getTokenBalances({
    accountAddress: args.accountAddress,
    contractAddress: args.contractAddress,
    includeMetadata: args.includeMetadata ?? true,
    metadataOptions: {
      verifiedOnly: args.verifiedOnly ?? true,
      includeContracts: [args.contractAddress],
    },
  });

  return res?.balances || [];
};

export const useCollectionBalance = (args: UseCollectionBalanceArgs) => {
  const indexerClient = useIndexerClient(args.chainId);

  const query = useQuery({
    queryKey: ["collectionBalance", args],
    queryFn: () => getCollectionBalance(indexerClient, args),
    retry: true,
    // The query is considered stale after 30 seconds (staleTime),
    // so it will automatically refetch every 30 seconds to update the data.
    staleTime: time.oneSecond * 30,
    enabled: !!args.chainId && !!args.accountAddress && !!args.contractAddress,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
};

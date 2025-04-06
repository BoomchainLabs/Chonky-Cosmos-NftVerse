import { Box, Text, Spinner } from "@0xsequence/design-system";
import { ContractInfo } from "@0xsequence/indexer";
import { Collectible } from "./Collectible";
import { UnpackedSaleConfigurationProps } from "../../../utils/primarySales/helpers";

interface ItemsForSaleProps {
  chainId: number;
  userPaymentCurrencyBalance: bigint | undefined;
  price: bigint;
  currencyDecimals: number | undefined;
  currencyData: ContractInfo | undefined;
  currencyIsLoading: boolean;
  saleConfiguration: UnpackedSaleConfigurationProps;
  refetchTotalMinted: () => void;
}

export const ItemsForSale = ({
  chainId,
  userPaymentCurrencyBalance,
  price,
  currencyDecimals,
  currencyData,
  currencyIsLoading,
  saleConfiguration,
  refetchTotalMinted,
}: ItemsForSaleProps) => {
  const refetchCollectionBalance = () => {};
  const isLoading = currencyIsLoading;

  if (isLoading) {
    return (
      <Box
        margin="2"
        color="text100"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="2"
      >
        <Text color="text100">Loading...</Text>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box width="full">
      <Collectible
        chainId={chainId}
        currencyData={currencyData}
        userPaymentCurrencyBalance={userPaymentCurrencyBalance}
        price={price}
        currencyDecimals={currencyDecimals}
        saleConfiguration={saleConfiguration}
        refetchCollectionBalance={refetchCollectionBalance}
        refetchTotalMinted={refetchTotalMinted}
      />
    </Box>
  );
};

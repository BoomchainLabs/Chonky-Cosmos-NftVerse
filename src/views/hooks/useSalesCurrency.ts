import { useReadContract } from "wagmi";

import { useContractInfo } from "../hooks/data";
import { SALES_CONTRACT_ABI } from "../../utils/primarySales/abis/salesContractAbi";
import { UnpackedSaleConfigurationProps } from "../../utils/primarySales/helpers";

interface SaleDetailsProps {
  paymentToken: string;
}

export const useSalesCurrency = (
  saleConfiguration: UnpackedSaleConfigurationProps,
) => {
  const {
    data: saleDetails,
    isLoading: paymentTokenIsLoading,
  }: { data: SaleDetailsProps | undefined; isLoading: boolean } =
    useReadContract({
      abi: SALES_CONTRACT_ABI,
      functionName: "saleDetails",
      chainId: saleConfiguration.chainId,
      address: saleConfiguration.salesContractAddress,
    });

  const paymentTokenAddress = (saleDetails?.paymentToken as string) || "";

  const {
    data: currencyContractInfoData,
    isLoading: currencyContractInfoIsLoading,
  } = useContractInfo(saleConfiguration.chainId, paymentTokenAddress);

  return {
    data: currencyContractInfoData,
    isLoading: paymentTokenIsLoading || currencyContractInfoIsLoading,
  };
};

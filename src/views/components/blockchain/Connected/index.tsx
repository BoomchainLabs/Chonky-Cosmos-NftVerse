import {
  Box,
  Button,
  Card,
  Collapsible,
  Image,
  Spinner,
  Text,
  useMediaQuery,
} from "@0xsequence/design-system";
import { Hex } from "viem";
import { useAccount, useDisconnect, useReadContract } from "wagmi";

import { ItemsForSale } from "../../ItemsForSale";
import { useCollectionBalance, useContractInfo } from "../../../hooks/data";
import { useSalesCurrency } from "../../../hooks/useSalesCurrency";
import { getChain } from "../../../../ERC20/getChain";
import SwitchNetwork from "./SwitchNetwork";
import {
  formatPriceWithDecimals,
  getSaleConfiguration,
} from "../../../../utils/primarySales/helpers";
import { SALES_CONTRACT_ABI } from "../../../../utils/primarySales/abis/salesContractAbi";
import { NFT_TOKEN_CONTRACT_ABI } from "../../../../utils/primarySales/abis/nftTokenContractAbi";
import ProgressBar from "../../ProgressBar";
import { ERC20_ABI } from "../../../../ERC20/ERC20_abi";
import { useMemo } from "react";

function calculateMintedPercentage(minted: number, totalMax: number): number {
  if (totalMax <= 0) {
    return 0;
  }

  const percentage = (minted / totalMax) * 100;
  return Math.floor(percentage);
}

interface GlobalSalesDetailsData {
  cost: bigint;
  endtime: bigint;
  merkleRoot: string;
  startTime: bigint;
  supplyCap: bigint;
}

const Connected = () => {
  const { address: userAddress, chainId, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const saleConfiguration = useMemo(
    () => getSaleConfiguration(chainId),
    [chainId],
  );
  const isMobile = useMediaQuery("isMobile");
  const { data: contractInfoData, isLoading: contractInfoIsLoading } =
    useContractInfo(
      saleConfiguration.chainId,
      saleConfiguration.nftTokenAddress,
    );
  const { data: currencyData, isLoading: currencyDataIsLoading } =
    useSalesCurrency(saleConfiguration);

  const {
    data: tokenSaleDetailsData,
    isLoading: tokenSaleDetailsDataIsLoading,
  } = useReadContract({
    abi: SALES_CONTRACT_ABI,
    functionName: "saleDetails",
    chainId: chainId,
    address: saleConfiguration.salesContractAddress,
  });

  const {
    data: userPaymentCurrencyBalance,
    // isLoading: userPaymentCurrencyBalanceIsLoading,
  } = useReadContract(
    currencyData?.address && userAddress
      ? {
          abi: ERC20_ABI,
          functionName: "balanceOf",
          chainId: chainId,
          address: currencyData.address as `0x${string}`,
          args: [userAddress],
          query: {
            refetchInterval: 30000,
            enabled: Boolean(currencyData?.address && userAddress),
          },
        }
      : undefined,
  );

  const {
    data: nftsMinted,
    // isLoading: nftsMintedIsLoading,
    refetch: refetchTotalMinted,
  } = useReadContract({
    abi: NFT_TOKEN_CONTRACT_ABI,
    functionName: "totalSupply",
    chainId: chainId,
    address: saleConfiguration.nftTokenAddress,
  });

  const {
    data: collectionBalanceData,
    isLoading: collectionBalanceIsLoading,
    // refetch: refetchCollectionBalance,
  } = useCollectionBalance({
    accountAddress: userAddress || "",
    contractAddress: saleConfiguration.nftTokenAddress,
    chainId: saleConfiguration.chainId,
    includeMetadata: true,
    verifiedOnly: true,
  });

  console.log(collectionBalanceData, "userCositas");

  const AddressDisplay = ({
    label,
    address,
    chainId,
  }: {
    label: string;
    address: string | Hex | undefined;
    chainId: number;
  }) => {
    const isMobile = useMediaQuery("isMobile");

    return (
      <Box
        justifyContent="space-between"
        {...(isMobile ? { flexDirection: "column" } : { textAlign: "left" })}
      >
        <Text variant="normal" color="text100" style={{ minWidth: 205 }}>
          {label}: &nbsp;
        </Text>
        <Text
          variant="normal"
          as="a"
          color="text100"
          href={`${getChain(chainId)?.explorerUrl}/address/${address}`}
          target="_blank"
          rel="noreferrer"
          ellipsis
        >
          {address}
        </Text>
      </Box>
    );
  };

  const UserInfoDisplay = ({
    label,
    value,
  }: {
    label: string;
    value: string | Hex | undefined;
  }) => {
    const isMobile = useMediaQuery("isMobile");

    return (
      <Box
        justifyContent="space-between"
        {...(isMobile ? { flexDirection: "column" } : { textAlign: "left" })}
      >
        <Text variant="normal" color="text100" style={{ minWidth: 205 }}>
          {label}: &nbsp;
        </Text>
        <Text variant="normal" color="text100" ellipsis>
          {value}
        </Text>
      </Box>
    );
  };

  const collectionName: string | undefined = contractInfoData?.name;
  const collectionImage = contractInfoData?.extensions?.ogImage;
  const collectionDescription: string | undefined =
    contractInfoData?.extensions?.description;
  const totalSupply =
    (tokenSaleDetailsData as GlobalSalesDetailsData)?.supplyCap?.toString() ||
    0;
  const price =
    (tokenSaleDetailsData as GlobalSalesDetailsData)?.cost || BigInt(0);
  const formattedNftsMinted = nftsMinted?.toString();
  const totalMintedNftsPercentaje = calculateMintedPercentage(
    Number(nftsMinted),
    Number(totalSupply),
  );
  const currencyDecimals: number | undefined = currencyData?.decimals;

  return (
    <Card
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap="3"
      style={{ width: "100%", margin: "0 auto" }}
    >
      <Box display="flex" justifyContent="flex-end" style={{ width: "100%" }}>
        {chain && <SwitchNetwork chain={chain} />}
      </Box>
      <Box width="full" paddingLeft="10" paddingRight="10">
        {contractInfoIsLoading ? (
          <Box justifyContent="center" alignItems="center">
            <Spinner />
          </Box>
        ) : (
          <Box gap="2" flexDirection="column">
            <h1>Sequence Primary Drop Sale Boilerplate</h1>
            <h2 className="homepage__marginBtNormal">Embedded Wallet</h2>
            <div>
              <Image
                src={collectionImage}
                alt={collectionName}
                style={{ width: "20rem", height: "auto" }}
              />
            </div>
            <Box display="flex" justifyContent="space-between">
              <Box gap="1" flexDirection="column" textAlign="left">
                <Text
                  variant="normal"
                  color="text100"
                  style={{ fontWeight: "700" }}
                >
                  Name:
                </Text>
                <Text variant="normal" color="text100">
                  {collectionName}
                </Text>
              </Box>
              <Box>
                {!tokenSaleDetailsDataIsLoading ? (
                  <Box display="flex" flexDirection="column" gap="4">
                    <Box display="flex" justifyContent="space-between">
                      <Text
                        variant="normal"
                        color="text100"
                        style={{ fontWeight: "700" }}
                      >
                        {totalMintedNftsPercentaje}% Minted
                      </Text>
                      <Text
                        variant="normal"
                        color="text100"
                        style={{ fontWeight: "700" }}
                      >
                        {formattedNftsMinted}/{totalSupply}
                      </Text>
                    </Box>
                    <ProgressBar percentage={totalMintedNftsPercentaje} />
                  </Box>
                ) : (
                  <Spinner />
                )}
              </Box>
            </Box>
            {collectionDescription && (
              <Box gap="1" flexDirection="column" textAlign="left">
                <Text
                  variant="normal"
                  color="text100"
                  style={{ fontWeight: "700" }}
                >
                  Description:
                </Text>
                <Text variant="normal" color="text100">
                  {collectionDescription}
                </Text>
              </Box>
            )}
            <Box gap="1" flexDirection="column" textAlign="left">
              <Text
                variant="normal"
                color="text100"
                style={{ fontWeight: "700" }}
              >
                Fund Test Payment Currencies in your wallet:
              </Text>
              <Text
                variant="link"
                as="a"
                href="https://faucet.circle.com/"
                target="_blank"
                rel="noreferrer noopener"
                style={{ textDecoration: "underline", color: "#1a73e8" }}
                aria-label="Open Faucet in a new tab"
              >
                Click here to Open Faucet
              </Text>
            </Box>
          </Box>
        )}
      </Box>
      {chainId && (
        <Collapsible label="Stuff for Nerds">
          <Box gap="1" flexDirection="column">
            <AddressDisplay
              label="User Address"
              address={userAddress}
              chainId={chainId}
            />
            <AddressDisplay
              label="Sales Contract"
              address={saleConfiguration.salesContractAddress}
              chainId={chainId}
            />
            <AddressDisplay
              label="NFT token Contract"
              address={saleConfiguration.nftTokenAddress}
              chainId={chainId}
            />
            <AddressDisplay
              label="Payment currency Address"
              address={currencyData?.address || ""}
              chainId={chainId}
            />
          </Box>
        </Collapsible>
      )}
      {chainId &&
        userPaymentCurrencyBalance &&
        userAddress &&
        currencyData &&
        currencyDecimals && (
          <Collapsible label="User information">
            <AddressDisplay
              label="User Address"
              address={userAddress}
              chainId={chainId}
            />
            <AddressDisplay
              label="Payment currency Address"
              address={currencyData?.address}
              chainId={chainId}
            />
            <UserInfoDisplay
              label="User Payment Currency Balance"
              value={`$${formatPriceWithDecimals(userPaymentCurrencyBalance, currencyDecimals)}`}
            />
          </Collapsible>
        )}
      {userAddress && !collectionBalanceIsLoading && collectionBalanceData && (
        <Collapsible label="User inventory">
          <Box
            display="flex"
            flexWrap="wrap"
            gap="6"
            justifyContent={
              collectionBalanceData?.length < 3 ? "flex-start" : "center"
            }
          >
            {collectionBalanceData?.map((balanceData) => {
              const { name, description, image, tokenId } =
                balanceData?.tokenMetadata ?? {};

              return (
                <Box
                  key={tokenId}
                  padding="1"
                  width="full"
                  flexDirection="column"
                  style={{
                    flexBasis: isMobile ? "100%" : "50%",
                    width: "fit-content",
                    maxWidth: "30.125rem",
                  }}
                >
                  <Card>
                    <Box flexDirection="row" gap="6">
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap="6"
                        alignItems="center"
                      >
                        <Box
                          display="flex"
                          flexDirection="column"
                          marginBottom="6"
                          gap="4"
                          style={{ width: "450px" }}
                        >
                          <Text
                            variant="large"
                            fontWeight="bold"
                            color="text100"
                          >
                            {name}
                          </Text>
                          <Text variant="normal" fontWeight="medium">
                            {description}
                          </Text>
                        </Box>
                        <Box
                          display="flex"
                          flexDirection="row"
                          gap="6"
                          justifyContent="center"
                        >
                          <Image
                            src={image}
                            style={{ width: "298px", borderRadius: "12px" }}
                          />
                        </Box>

                        <Box display="flex" flexDirection="row" gap="6">
                          <Box display="flex" flexDirection="column" gap="4">
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              gap="4"
                            >
                              <Box
                                flexDirection="row"
                                justifyContent="space-between"
                                gap="2"
                                style={{ width: "298px" }}
                              >
                                <Text
                                  variant="normal"
                                  fontWeight="bold"
                                  color="text100"
                                  style={{ textAlign: "left" }}
                                >
                                  Token ID: {tokenId || "No metadata"}
                                </Text>
                                <Text
                                  variant="normal"
                                  fontWeight="bold"
                                  color="text100"
                                  style={{ textAlign: "left" }}
                                >
                                  Amount: {balanceData?.balance || "0"}
                                </Text>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              );
            })}
          </Box>
        </Collapsible>
      )}

      <ItemsForSale
        chainId={saleConfiguration.chainId}
        userPaymentCurrencyBalance={userPaymentCurrencyBalance}
        price={price}
        currencyDecimals={currencyDecimals}
        currencyData={currencyData}
        currencyIsLoading={currencyDataIsLoading}
        saleConfiguration={saleConfiguration}
        refetchTotalMinted={refetchTotalMinted}
      />
      <Button label="Disconnect" onClick={disconnect} />
    </Card>
  );
};

export default Connected;

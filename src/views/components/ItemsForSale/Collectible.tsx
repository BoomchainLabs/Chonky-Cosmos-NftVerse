import {
  Box,
  Card,
  Image,
  Skeleton,
  Text,
  useMediaQuery,
} from "@0xsequence/design-system";
import { BuyWithCryptoCardButton } from "./BuyWithCryptoCardButton";
import { useEffect, useState } from "react";
import { ContractInfo } from "@0xsequence/indexer";
import { toast } from "react-toastify";
import PurchaseAnimation from "../blockchain/Connected/PurchaseAnimation";
import { formatPriceWithDecimals } from "../../../utils/primarySales/helpers";
import { UnpackedSaleConfigurationProps } from "../../../utils/primarySales/helpers";
import { SendTransactionErrorType } from "viem";

interface CollectibleProps {
  chainId: number;
  currencyData: ContractInfo | undefined;
  userPaymentCurrencyBalance: bigint | undefined;
  price: bigint;
  currencyDecimals: number | undefined;
  saleConfiguration: UnpackedSaleConfigurationProps;
  refetchCollectionBalance: () => void;
  refetchTotalMinted: () => void;
}

export const Collectible = ({
  chainId,
  currencyData,
  userPaymentCurrencyBalance,
  price,
  currencyDecimals,
  saleConfiguration,
  refetchCollectionBalance,
  refetchTotalMinted,
}: CollectibleProps) => {
  const isMobile = useMediaQuery("isMobile");
  const [amount, setAmount] = useState(0);
  const [txExplorerUrl, setTxExplorerUrl] = useState("");
  const [txError, setTxError] = useState<SendTransactionErrorType | null>(null);
  const [purchasingNft, setPurchasingNft] = useState<boolean>(false);
  // const logoURI = currencyData?.logoURI;

  const formmatedPrice = currencyDecimals
    ? formatPriceWithDecimals(price, currencyDecimals)
    : 0;

  useEffect(() => {
    if (!txError || JSON.stringify(txError) === "{}") return;
    toast(`Error to purchase NFT`, { type: "error" });
    setPurchasingNft(false);
    console.error(txError);
  }, [txError]);

  const increaseAmount = () => {
    if (purchasingNft) return;
    setAmount(amount + 1);
  };

  const decreaseAmount = () => {
    if (amount === 0 || purchasingNft) return;
    setAmount(amount - 1);
  };

  const resetAmount = () => {
    setAmount(0);
  };

  return (
    <Box
      padding="1"
      width="full"
      flexDirection="column"
      style={{
        flexBasis: isMobile ? "100%" : "50%",
        width: "fit-content",
        maxWidth: "50rem",
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
              <Text variant="large" fontWeight="bold" color="text100">
                Buy Now and Test Your Luck
              </Text>
              <Text variant="normal" fontWeight="medium">
                In just a few days, all chests will be revealed. Good luck!
              </Text>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              gap="6"
              justifyContent="center"
            >
              <Image
                src="/chest.png"
                style={{ width: "298px", borderRadius: "12px" }}
              />
            </Box>

            <Box display="flex" flexDirection="row" gap="6">
              <Box display="flex" flexDirection="column" gap="4">
                <Box display="flex" justifyContent="space-between" gap="4">
                  <Box flexDirection="row" gap="2" style={{ width: "298px" }}>
                    <Text
                      variant="normal"
                      fontWeight="bold"
                      color="text100"
                      style={{ textAlign: "left" }}
                    >
                      Price: {formmatedPrice}
                    </Text>

                    <Skeleton style={{ width: 20, height: 20 }} />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              display="flex"
              padding="4"
              borderRadius="lg"
              gap="4"
              style={{ backgroundColor: "rgba(32, 32, 32, 1)", width: "25rem" }}
            >
              <Box
                display="flex"
                alignItems="center"
                gap="8"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  width: "fit-content",
                  padding: "0.5rem 1rem",
                }}
                borderRadius="lg"
              >
                <Text
                  variant="large"
                  fontWeight="bold"
                  onClick={decreaseAmount}
                  style={{
                    cursor: "pointer",
                    color: "#ffffff",
                    fontWeight: 900,
                  }}
                >
                  -
                </Text>
                <Text
                  variant="large"
                  fontWeight="bold"
                  style={{ color: "#ffffff" }}
                >
                  {amount}
                </Text>
                <Text
                  variant="large"
                  fontWeight="bold"
                  onClick={increaseAmount}
                  style={{
                    cursor: "pointer",
                    color: "#ffffff",
                    fontWeight: 900,
                  }}
                >
                  +
                </Text>
              </Box>
              <BuyWithCryptoCardButton
                amount={amount}
                chainId={chainId}
                collectionAddress={saleConfiguration.nftTokenAddress}
                // tokenId={tokenMetadata.tokenId}
                resetAmount={resetAmount}
                setTxExplorerUrl={setTxExplorerUrl}
                setTxError={setTxError}
                setPurchasingNft={setPurchasingNft}
                userPaymentCurrencyBalance={userPaymentCurrencyBalance}
                price={price}
                currencyData={currencyData}
                refetchCollectionBalance={refetchCollectionBalance}
                refetchTotalMinted={refetchTotalMinted}
                // refetchNftsMinted={refetchNftsMinted}
              />
            </Box>
            {purchasingNft && (
              <PurchaseAnimation
                amount={amount}
                image="/chest.png"
                name="Chest"
              />
            )}
            {txError && JSON.stringify(txError) != "{}" && (
              <span>Error to purchase NFT. Details in console</span>
            )}
            {txExplorerUrl && (
              <Box display="flex" flexDirection="column" marginBottom="3">
                <Text variant="large" color="text100">
                  Purchase Completed Successfully
                </Text>
                <a
                  href={txExplorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>View transaction in explorer</span>
                  <br />
                </a>
              </Box>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

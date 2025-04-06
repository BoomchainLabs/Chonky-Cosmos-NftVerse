import { encodeFunctionData, SendTransactionErrorType, toHex } from "viem";
import {
  usePublicClient,
  useWalletClient,
  useAccount,
  useSendTransaction,
} from "wagmi";
import { ERC20 } from "../../../ERC20/ERC20";

import { SALES_CONTRACT_ABI } from "../../../utils/primarySales/abis/salesContractAbi";
import { useEffect, useState } from "react";
import { getChain } from "../../../ERC20/getChain";
import { getSaleConfiguration } from "../../../utils/primarySales/helpers";
import { toast } from "react-toastify";
import { ContractInfo } from "@0xsequence/indexer";

interface BuyWithCryptoCardButtonProps {
  // tokenId: string;
  collectionAddress: string;
  chainId: number;
  amount: number;
  resetAmount: () => void;
  setTxExplorerUrl: (url: string) => void;
  setTxError: (error: SendTransactionErrorType | null) => void;
  setPurchasingNft: (value: boolean) => void;
  userPaymentCurrencyBalance: bigint | undefined;
  price: bigint;
  currencyData: ContractInfo | undefined;
  refetchCollectionBalance: () => void;
  refetchTotalMinted: () => void;
  // refetchNftsMinted: () => void;
}

export const BuyWithCryptoCardButton = ({
  // tokenId,
  // collectionAddress,
  chainId,
  amount,
  resetAmount,
  setTxExplorerUrl,
  setTxError,
  userPaymentCurrencyBalance,
  setPurchasingNft,
  price,
  currencyData,
  refetchCollectionBalance,
  refetchTotalMinted,
  // refetchNftsMinted,
}: BuyWithCryptoCardButtonProps) => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const {
    address: userAddress,
    // chainId: chainIdUser
  } = useAccount();
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [chainInfo, setChainInfo] = useState<{ [key: string]: any }>({});
  const {
    data: txnData,
    sendTransaction,
    isPending: isPendingSendTxn,
    error,
    reset,
  } = useSendTransaction();
  const nftPriceBigInt = price ? price : BigInt(0);
  const amountBigInt = BigInt(amount);
  const totalPrice = nftPriceBigInt * amountBigInt;

  const onClickBuy = async () => {
    if (
      !publicClient ||
      !walletClient ||
      !userAddress ||
      !currencyData ||
      isPendingSendTxn ||
      amount <= 0 ||
      !userPaymentCurrencyBalance?.toString() ||
      userPaymentCurrencyBalance < totalPrice
    ) {
      return;
    }

    setTxError(null);
    setTxExplorerUrl("");
    setPurchasingNft(true);
    const saleConfiguration = getSaleConfiguration(chainId);
    const allowance = await ERC20.getAllowance(
      currencyData.address,
      userAddress,
      saleConfiguration.salesContractAddress,
      chainId,
    );

    if (!allowance || allowance === 0n) {
      await ERC20.approveInfinite(
        currencyData.address,
        saleConfiguration.salesContractAddress,
        walletClient,
      );
    }

    /**
     * Mint tokens.
     * @param to Address to mint tokens to.
     * @param amount Amounts of tokens to mint.
     * @param expectedPaymentToken ERC20 token address to accept payment in. address(0) indicates ETH.
     * @param maxTotal Maximum amount of payment tokens.
     * @param proof Merkle proof for allowlist minting.
     * @notice Sale must be active for all tokens.
     * @dev tokenIds must be sorted ascending without duplicates.
     * @dev An empty proof is supplied when no proof is required.
     */

    const calldata = encodeFunctionData({
      abi: SALES_CONTRACT_ABI,
      functionName: "mint",
      args: [
        userAddress,
        [BigInt(amount)],
        currencyData.address,
        totalPrice,
        [toHex(0, { size: 32 })],
      ],
    });

    const transactionParameters = {
      to: saleConfiguration.salesContractAddress,
      data: calldata,
      value: BigInt(0),
    };

    sendTransaction(transactionParameters);
  };

  useEffect(() => {
    if (!chainId) return;
    reset();
    const chainInfoResponse = getChain(chainId);
    if (chainInfoResponse) {
      setChainInfo(chainInfoResponse);
    }
  }, [chainId]);

  useEffect(() => {
    if (!error) return;
    setTxError(error as SendTransactionErrorType);
    setPurchasingNft(false);
  }, [error]);

  useEffect(() => {
    if (!txnData || isPendingSendTxn) return;
    resetAmount();
    toast(
      <div>
        Purchase Completed Successfully.{" "}
        <a
          href={`${chainInfo.explorerUrl}/tx/${txnData}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "rgba(32, 129, 226, 1)",
            textDecoration: "underline",
          }}
        >
          View transaction in explorer
        </a>
      </div>,
    );
    setTxExplorerUrl(`${chainInfo.explorerUrl}/tx/${txnData}`);
    setPurchasingNft(false);
    setTimeout(() => {
      refetchCollectionBalance();
      refetchTotalMinted();
      // refetchNftsMinted();
    }, 3000);
  }, [txnData, isPendingSendTxn]);

  return (
    <>
      <button
        style={{
          backgroundColor: "rgba(32, 129, 226, 1)",
          padding: "12px 6px",
          borderRadius: "0.75rem",
          width: "100%",
          transition: "background-color 0.3s ease",
          border: "none",
          outline: "none",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(25, 100, 176, 1)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(32, 129, 226, 1)")
        }
        onClick={onClickBuy}
      >
        {userPaymentCurrencyBalance?.toString() &&
        (userPaymentCurrencyBalance?.toString() === "0" ||
          userPaymentCurrencyBalance < totalPrice)
          ? "Insufficient funds"
          : !isPendingSendTxn
            ? "Purchase"
            : "Purchasing..."}
      </button>
    </>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ERC20 } from "../../ERC20/ERC20";

export const BigIntReplacer = (_: any, value: any) =>
  typeof value === "bigint" ? { type: "bigint", v: value.toString() } : value;

export const BigIntReviver = (_: any, value: any) =>
  value?.type === "bigint" ? BigInt(value.v) : value;

import { useQuery } from "@tanstack/react-query";

interface Props {
  spenderAddress: string;
  erc20Address: string;
  userAddress: string;
  targetAmount: bigint;
  chainId: number;
}

export const useERC20Approval = (
  arg: Partial<Props & { disabled?: boolean }>,
) =>
  useQuery({
    queryKey: ["orderERC20Checks", JSON.stringify(arg, BigIntReplacer)],
    queryFn: () =>
      getERC20BalanceAndApprovals({
        spenderAddress: arg.spenderAddress!,
        erc20Address: arg.erc20Address!,
        userAddress: arg.userAddress!,
        targetAmount: arg.targetAmount!,
        chainId: arg.chainId!,
      }),
    retry: false,
    refetchInterval: 15000,
    enabled:
      !!arg.spenderAddress &&
      !!arg.erc20Address &&
      !!arg.userAddress &&
      !!arg.targetAmount &&
      !!arg.chainId &&
      !arg.disabled,
  });

const getERC20BalanceAndApprovals = async (arg: Props) => {
  const [erc20CurrencyAllowance, erc20CurrencyUserBalance] = await Promise.all([
    ERC20.getAllowance(
      arg.erc20Address,
      arg.userAddress,
      arg.spenderAddress,
      arg.chainId,
    ),
    ERC20.balanceOf(arg.erc20Address, arg.userAddress, arg.chainId),
  ]);

  const isRequiresAllowanceApproval = erc20CurrencyAllowance < arg.targetAmount;

  const isUserInsufficientBalance = erc20CurrencyUserBalance < arg.targetAmount;

  return {
    erc20CurrencyAllowance,
    erc20CurrencyUserBalance,
    isRequiresAllowanceApproval,
    isUserInsufficientBalance,
  };
};

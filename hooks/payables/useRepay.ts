import { Contract } from "@ethersproject/contracts";
import type { TransactionResponse } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import U_TOKENT_ABI from "constants/abis/uToken.json";
import useERC20Contract from "hooks/contracts/useERC20Contract";
import useMarketRegistryContract from "hooks/contracts/useMarketRegistryContract";
import useCurrentToken from "hooks/useCurrentToken";
import { useCallback } from "react";
import { signDaiPermit } from "eth-permit";
import { makeTxWithGasEstimate } from "../../util/gasEstimation";
import { MaxUint256 } from "@ethersproject/constants";

export default function useRepay() {
  const { library, account } = useWeb3React();
  const DAI = useCurrentToken();
  const marketRegistryContract = useMarketRegistryContract();
  const DAIContract = useERC20Contract(DAI);

  return useCallback(
    async (amount: number | string): Promise<TransactionResponse> => {
      const res = await marketRegistryContract.tokens(DAI);
      const uTokenAddress = res.uToken;

      const uTokenContract = new Contract(
        uTokenAddress,
        U_TOKENT_ABI,
        library.getSigner()
      );

      const repayAmount = parseUnits(String(amount), 18);
      const allowance = await DAIContract.allowance(account, uTokenAddress);
      if (allowance.lt(repayAmount)) {
        try {
          const result = await signDaiPermit(
            library.provider,
            DAI,
            account,
            uTokenAddress
          );
  
          const txResponse = await  makeTxWithGasEstimate(
            uTokenContract,
            'repayBorrowWithPermit',
            [
              account,
              repayAmount.toString(),
              result.nonce,
              result.expiry,
              result.v,
              result.r,
              result.s
            ],
            null,
            true
          );
          return txResponse;
        } catch (err) {
          await makeTxWithGasEstimate(
            DAIContract,
            'approve',
            [uTokenAddress, MaxUint256]
          )
        }
      }

      return makeTxWithGasEstimate(
        uTokenContract,
        'repayBorrow',
        [repayAmount]
      );
    },
    [account, DAI, marketRegistryContract, DAIContract]
  );
}

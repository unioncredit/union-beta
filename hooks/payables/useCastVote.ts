import type { TransactionResponse } from "@ethersproject/providers";
import { useCallback } from "react";
import useGovernanceContract from "../contracts/useGovernanceContract";

export default function useCastVote() {
  const governanceContract = useGovernanceContract();

  return useCallback(
    async (
      proposalId: string,
      support: boolean
    ): Promise<TransactionResponse> => {
      return governanceContract.castVote(proposalId, support);
    },
    [governanceContract]
  );
}
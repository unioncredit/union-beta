import { isAddress } from "@ethersproject/address";
import type { Contract } from "@ethersproject/contracts";
import { formatUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import { roundDown } from "util/numbers";
import parseRes from "util/parseRes";
import useUserContract from "../contracts/useUserContract";
import useCurrentToken from "../useCurrentToken";

const getStakeData = (memberContract: Contract) => async (
  _: any,
  account: string,
  tokenAddress: string
) => {
  try {
    const totalStake = await memberContract.getStakerBalance(
      account,
      tokenAddress
    );

    const totalLocked = await memberContract.getTotalLockedStake(
      account,
      tokenAddress
    );

    const totalFrozen = await memberContract.getTotalFrozenAmount(
      account,
      tokenAddress
    );

    return {
      totalStake: parseRes(totalStake),
      utilizedStake: parseRes(totalLocked.sub(totalFrozen)),
      withdrawableStake: roundDown(
        formatUnits(totalStake.sub(totalLocked), 18)
      ),
      defaultedStake: parseRes(totalFrozen),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default function useStakeData() {
  const { account } = useWeb3React();
  const memberContract = useUserContract();
  const curToken = useCurrentToken();

  const shouldFetch =
    !!memberContract && typeof account === "string" && isAddress(curToken);

  return useSWR(
    shouldFetch ? ["StakeData", account, curToken] : null,
    getStakeData(memberContract)
  );
}
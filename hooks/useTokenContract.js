import ABI from "constants/abis/erc20Detailed.json";
import useContract from "./useContract";

export default function useTokenContract(tokenAddress) {
  return useContract(tokenAddress, ABI);
}

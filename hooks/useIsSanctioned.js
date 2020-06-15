import { OFAC_SANCTIONED } from "../constants/variables";
import useSWR from "swr";
import { useMemo } from "react";

const ENDPOINT = "https://www.cloudflare.com/cdn-cgi/trace";

const fetcher = async (...args) => {
  const res = await fetch(...args);
  return res.text();
};

const keyValueToJSON = (raw) =>
  raw.split("\n").reduce((acc, cur) => {
    const [key, value] = cur.split("=");

    acc[key] = value;

    return acc;
  }, {});

/*
 * @name useIsSanctioned
 * Returns 'true' or 'false' whether or not the current
 *   user's IP is located in an OFAC sanctioned country.
 */
export default function useIsSanctioned() {
  const { data } = useSWR(ENDPOINT, fetcher);

  let isSanctioned = false;

  if (!!data) {
    const { loc } = keyValueToJSON(data);

    console.log(loc);

    if (OFAC_SANCTIONED.includes(loc)) {
      console.log("SANCTIONED");

      isSanctioned = true;
    }
  }

  return isSanctioned;
}

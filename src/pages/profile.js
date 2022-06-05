import { useMemo } from "react";
import { Helmet } from "react-helmet";
import ProfileView from "views/profile";
import { PageHead } from "components-ui";
import { useForceConnect } from "hooks/useForceConnect";
import useENS from "hooks/useENS";
import LoggedOutView from "views/loggedOut";
import { isAddress } from "@ethersproject/address";
import { useParams } from "react-router-dom";

export default function ProfilePage() {
  const [forceConnect] = useForceConnect();
  const { address } = useParams();
  const ens = useENS(address);

  const userAddress = useMemo(() => {
    if (isAddress(address)) {
      return address;
    }
    return ens.address;
  }, [address, ens.address]);

  const host = window.location.host;

  return (
    <>
      <PageHead title="Profile | Union" />
      <Helmet>
        <meta
          key="og:image"
          property="og:image"
          content={`https://${host}/api/og/profile?address=${userAddress}`}
        />
        <meta
          key="twitter:image"
          property="twitter:image"
          content={`https://${host}/api/og/profile?address=${userAddress}`}
        />
        <meta
          property="twitter:title"
          key="twitter:title"
          content={`Union Member ${userAddress}`}
        />
      </Helmet>

      {address && (
        <>
          {forceConnect ? (
            <LoggedOutView />
          ) : userAddress ? (
            <ProfileView />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}

export function getServerSideProps(context) {
  return {
    props: { params: context.params, host: context.req.headers.host },
  };
}

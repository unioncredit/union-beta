import { useWeb3React } from "@web3-react/core";
import WalletOption from "./WalletOption";
import { useAutoEffect } from "hooks.macro";
import useEagerConnect from "hooks/useEagerConnect";
import useIsSanctioned from "hooks/useIsSanctioned";
import { login } from "lib/auth";
import { CONNECTORS, walletconnect } from "lib/connectors";
import getErrorMessage from "lib/getErrorMessage";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import Modal from "../../modal";
import MetamaskSwitcher from "components/MetamaskSwitcher";
import {
  useUpdateWalletModalView,
  useWalletModalOpen,
  useWalletModalToggle,
  useWalletModalView,
} from "./state";

const WalletOptions = ({
  activatingConnector,
  setActivatingConnector,
  triedEager,
}) => {
  const { error, activate, connector } = useWeb3React();

  const isSanctioned = useIsSanctioned();
  const router = useRouter();

  const toggle = useWalletModalToggle();

  return (
    <Fragment>
      {Object.keys(CONNECTORS).map((name, i) => {
        const currentConnector = CONNECTORS[name];
        const activating = currentConnector === activatingConnector;
        const connected = currentConnector === connector;
        const disabled = Boolean(
          !triedEager ||
            !!activatingConnector ||
            connected ||
            !!error ||
            isSanctioned
        );

        const handleSignIn = async () => {
          setActivatingConnector(currentConnector);

          await activate(CONNECTORS[name]);

          toggle();

          if (name === "Injected") {
            login();
          }

          if (router.pathname === "/") router.push("/stake");
        };

        if (name === "Injected" && !(window?.ethereum || window?.web3))
          return null;

        return (
          <WalletOption
            key={i}
            name={name}
            onClick={handleSignIn}
            disabled={disabled}
            activating={activating}
          />
        );
      })}
    </Fragment>
  );
};

const WalletModal = () => {
  const { error, connector, deactivate } = useWeb3React();

  const walletView = useWalletModalView();

  const {
    setWalletViewCreate,
    setWalletViewSignIn,
  } = useUpdateWalletModalView();

  const open = useWalletModalOpen();
  const toggle = useWalletModalToggle();

  const [activatingConnector, setActivatingConnector] = useState();

  useAutoEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  });

  /**
   * Handle disconnecting from the wallet if an error occurs
   */
  useAutoEffect(() => {
    if (error) {
      if (connector === walletconnect) connector.close();

      deactivate();
      window.alert(getErrorMessage(error));

      setActivatingConnector(undefined);
    }
  });

  const triedEager = useEagerConnect();

  return (
    <Modal
      isOpen={open}
      onDismiss={toggle}
      dangerouslyBypassFocusLock={Boolean(activatingConnector)}
    >
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-4">
          <p className="text-center text-xl mb-3">
            {walletView === "SIGN_IN" ? "Sign in" : "Create an account"}
          </p>
          <div className="w-full h-1 bg-pink-pure" />
        </div>

        <div className="mb-4" suppressHydrationWarning={true}>
          {typeof ethereum !== "undefined" && ethereum && ethereum.chainId ? ( // eslint-disable-line no-undef
            <MetamaskSwitcher />
          ) : null}
        </div>

        <div className="mb-6 space-y-2">
          <WalletOptions
            activatingConnector={activatingConnector}
            setActivatingConnector={setActivatingConnector}
            triedEager={triedEager}
          />
        </div>

        {walletView === "CREATE" && (
          <div className="mb-6">
            <p className="text-center text-sm leading-snug crop-snug text-grey-pure">
              By signing up, you agree to our <br />
              <a
                className="text-type-base hover:underline focus:underline focus:outline-none"
                href=""
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                className="text-type-base hover:underline focus:underline focus:outline-none"
                href=""
              >
                Privacy Policy
              </a>
            </p>
          </div>
        )}

        <div className="divider" />

        {walletView === "SIGN_IN" ? (
          <p className="text-sm text-center mt-6">
            Don't have an account?{" "}
            <button
              onClick={setWalletViewCreate}
              className="underline font-medium inline whitespace-no-wrap focus:outline-none focus:shadow-outline rounded"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <button
              onClick={setWalletViewSignIn}
              className="underline font-medium inline whitespace-no-wrap focus:outline-none focus:shadow-outline rounded"
            >
              Sign in
            </button>
          </p>
        )}

        <p className="sm:hidden text-sm text-center mt-12">
          <button onClick={toggle} className="underline font-medium px-2 py-1">
            Close
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default WalletModal;

import { useWeb3React } from "@web3-react/core";
import ProfileImage from "components/ProfileImage";
import LabelPair from "components/labelPair";
import { useAutoCallback } from "hooks.macro";
import useRemoveVouch from "hooks/payables/useRemoveVouch";
import use3BoxPublicData from "hooks/use3BoxPublicData";
import useAddressLabels from "hooks/useAddressLabels";
import useCopy from "hooks/useCopy";
import useENSName from "hooks/useENSName";
import useToast, { FLAVORS } from "hooks/useToast";
import useTrustData from "hooks/useTrustData";
import delay from "lib/delay";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import getIPFSAssetLink from "util/getIPFSAssetLink";
import handleTxError from "util/handleTxError";
import truncateAddress from "util/truncateAddress";
import Address from "../address";
import AdjustTrustForm from "../adjustTrustForm";
import Button from "../button";
import HealthBar from "../healthBar";
import Identicon from "../identicon";
import Modal, { BackButton, CloseButton } from "../modal";
import { useAddressModalOpen, useAddressModalToggle } from "./state";

const InlineLabelEditor = ({ label, ENSName, address, public3BoxName }) => {
  const { setLabel } = useAddressLabels();

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      label: label ?? public3BoxName,
    },
  });

  const { isSubmitting, isDirty } = formState;

  const [copied, copy] = useCopy();

  const handleCopyAddress = () => copy(address);

  const onSubmit = async (data) => {
    await setLabel(address, data.label);

    await delay(1000);

    reset({ label: data.label });
  };

  return (
    <form method="POST" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center">
        <input
          type="text"
          className="text-lg font-semibold text-center w-auto bg-transparent rounded-none focus:outline-none"
          name="label"
          autoCapitalize="off"
          placeholder="Add a label"
          autoCorrect="off"
          autoComplete="off"
          ref={register}
          id="label"
        />
      </div>
      {isDirty ? (
        <button
          type="submit"
          className="focus:outline-none leading-none font-medium text-type-light underline"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleCopyAddress}
          className="focus:outline-none leading-none font-medium text-type-light"
          title={address}
        >
          {copied ? "Copied!" : ENSName ?? truncateAddress(address, 6)}
        </button>
      )}
    </form>
  );
};

const ADDRESS_VIEWS = {
  HOME: "HOME",
  ADJUST: "ADJUST",
};

const AddressModal = ({ address, vouched, trust, used, health }) => {
  const { library } = useWeb3React();

  const isOpen = useAddressModalOpen();
  const toggle = useAddressModalToggle();

  const [addressView, setAddressView] = useState(ADDRESS_VIEWS.HOME);

  useEffect(() => {
    if (isOpen) setAddressView(ADDRESS_VIEWS.HOME);
  }, [isOpen]);

  const ENSName = useENSName(address);

  const { getLabel } = useAddressLabels();
  const label = getLabel(address);

  const { data, error } = use3BoxPublicData(address);
  const has3BoxName = !!data && !error && data?.name;
  const has3BoxProfileImage = !!data && !error && data?.image;

  const [removingAddress, removingAddressSet] = useState(false);
  const removeVouch = useRemoveVouch();

  const { mutate: updateTrustData } = useTrustData();

  const addToast = useToast();

  const removeAddress = useAutoCallback(async () => {
    let hidePendingToast = () => {};
    let txReceipt = {};

    try {
      removingAddressSet(true);

      const tx = await removeVouch(address);

      const { hide: hidePending } = addToast(FLAVORS.TX_PENDING(tx.hash));

      hidePendingToast = hidePending;

      const receipt = await library.waitForTransaction(tx.hash);

      if (receipt.status === 1) {
        hidePending();

        addToast(FLAVORS.TX_SUCCESS(tx.hash));

        removingAddressSet(false);

        await updateTrustData();

        return;
      }

      hidePending();

      txReceipt = receipt;

      throw new Error(receipt.logs[0]);
    } catch (err) {
      hidePendingToast();

      const message = handleTxError(err);

      addToast(FLAVORS.TX_ERROR(message, txReceipt?.transactionHash));

      removingAddressSet(false);
    }
  });

  const onComplete = async () => {
    toggle();

    await updateTrustData();
  };

  return (
    <Modal isOpen={isOpen} onDismiss={toggle}>
      <div className="p-4 sm:p-6 relative">
        {addressView === ADDRESS_VIEWS.HOME ? (
          <Fragment>
            <div className="absolute right-0 top-0 mr-6 mt-6">
              <CloseButton onClick={toggle} large />
            </div>

            <div className="flex justify-center mt-4">
              {has3BoxProfileImage ? (
                <ProfileImage
                  alt={ENSName ?? address}
                  image={data.image}
                  size={72}
                />
              ) : (
                <Identicon address={address} extraLarge />
              )}
            </div>

            <div className="mt-4 text-center">
              <InlineLabelEditor
                address={address}
                ENSName={ENSName}
                label={label}
                public3BoxName={has3BoxName ? data.name : null}
              />
            </div>

            <div className="mt-16">
              <LabelPair
                labelColor="text-grey-pure"
                label="Trust"
                value={trust}
                valueType="DAI"
              />
              <LabelPair
                labelColor="text-grey-pure"
                label="Vouched"
                value={vouched}
                valueType="DAI"
              />
              <LabelPair
                labelColor="text-grey-pure"
                label="Used stake"
                value={used}
                valueType="DAI"
              />
              <LabelPair
                labelColor="text-grey-pure"
                label="Health"
                valueSlot={<HealthBar health={health} />}
              />
            </div>

            <div className="mt-24">
              <Button full onClick={() => setAddressView(ADDRESS_VIEWS.ADJUST)}>
                Adjust Vouch
              </Button>
            </div>

            <div className="mt-4">
              <Button
                full
                invert
                onClick={removeAddress}
                disabled={removingAddress}
                submitting={removingAddress}
              >
                Remove Address
              </Button>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="absolute left-0 top-0 ml-6 mt-6">
              <BackButton onClick={() => setAddressView(ADDRESS_VIEWS.HOME)} />
            </div>

            <div className="mt-12">
              <p>Edit this member's trust</p>
            </div>

            <div className="mt-4 cursor-text">
              <Address address={address} large copyable withLabel />
            </div>

            <div className="mt-4">
              <div className="divider" />
            </div>

            <div className="mt-4">
              <dl className="flex justify-between items-center leading-tight">
                <dt>Current Trust</dt>
                <dd className="text-right">{`${trust} DAI`}</dd>
              </dl>
            </div>

            <div className="mt-4">
              <div className="divider" />
            </div>

            <div className="mt-6">
              <AdjustTrustForm
                address={address}
                vouched={trust}
                onComplete={onComplete}
              />
            </div>
          </Fragment>
        )}
      </div>
    </Modal>
  );
};

export default AddressModal;

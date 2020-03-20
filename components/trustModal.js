import Modal, { ModalHeader } from "./modal";
import { useTrustModalOpen, useTrustModalToggle } from "@contexts/Stake";
import Button from "./button";

const TrustModal = () => {
  const open = useTrustModalOpen();
  const toggle = useTrustModalToggle();

  return (
    <Modal isOpen={open} onDismiss={toggle}>
      <ModalHeader title="Vouch for a member" onDismiss={toggle} />
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis vel
          distinctio quod tempora necessitatibus consequuntur ab blanditiis id
          cumque dolores facere porro nostrum, voluptatum aliquam pariatur saepe
          eos consequatur dolore.
        </p>

        <div className="w-full h-px bg-accent" />

        <div className="mt-12">
          <Button full>Confirm</Button>
        </div>
      </div>
    </Modal>
  );
};

export default TrustModal;

import { DialogContent, DialogOverlay } from "@reach/dialog";
import VisuallyHidden from "@reach/visually-hidden";
import classNames from "classnames";
import PropTypes from "prop-types";
import Back from "svgs/Back";
import Close, { CloseLarge } from "svgs/Close";

export const CloseButton = ({ circle = false, large = false, ...rest }) => {
  const cachedClassNames = classNames(
    "focus:outline-none focus:shadow-outline bg-white items-center justify-center inline-flex text-type-light",
    circle ? "h-12 w-12 rounded-full shadow-button" : "h-6 w-6 rounded"
  );

  return (
    <button className={cachedClassNames} {...rest}>
      <VisuallyHidden>Close</VisuallyHidden>
      {large ? <CloseLarge /> : <Close />}
    </button>
  );
};

export const BackButton = ({ circle = false, ...rest }) => {
  const cachedClassNames = classNames(
    "focus:outline-none focus:shadow-outline bg-white items-center justify-center inline-flex text-type-light",
    circle ? "h-12 w-12 rounded-full shadow-button" : "h-6 w-6 rounded"
  );

  return (
    <button className={cachedClassNames} {...rest}>
      <VisuallyHidden>Back</VisuallyHidden>
      <Back />
    </button>
  );
};

export const ModalHeader = ({ title, onDismiss }) => (
  <div className="px-4 py-6 sm:px-6 border-b relative">
    <p className="text-center">{title}</p>
    <div className="absolute right-0 top-0 mr-6 mt-6">
      <CloseButton onClick={onDismiss} />
    </div>
  </div>
);

const Modal = ({ isOpen, onDismiss, children, label = "Modal", ...rest }) => {
  return (
    <DialogOverlay isOpen={isOpen} onDismiss={onDismiss}>
      <DialogContent aria-label={label} {...rest}>
        {children}
      </DialogContent>
    </DialogOverlay>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  label: PropTypes.string,
  children: PropTypes.any,
};

export default Modal;

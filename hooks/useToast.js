import cogoToast from "cogo-toast";
import { useCallback } from "react";

const ToastBody = ({ body, onDismiss }) => (
  <div className="flex justify-between" style={{ width: 360 }}>
    <p className="mr-16 text-sm whitespace-no-wrap">{body}</p>
    <button
      className="text-sm font-medium underline focus:outline-none"
      onClick={onDismiss}
    >
      Dismiss
    </button>

    <style jsx global>{`
      .ct-toast {
        padding: calc(1.5rem - 1px);
        border-radius: 0.5rem;
        box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.04);
        border: 1px solid #f3f4f7;
      }

      .ct-text-group {
        margin-left: 1.5rem;
      }
    `}</style>
  </div>
);

/**
 * @todo Add proper icons
 */
const TOAST_ICONS = {
  error: () => (
    <div className="h-10 w-10 bg-alert-error bg-opacity-10 rounded-full" />
  ),
  info: () => (
    <div className="h-10 w-10 bg-alert-loading  bg-opacity-10 rounded-full" />
  ),
  loading: () => (
    <div className="h-10 w-10 bg-alert-loading bg-opacity-10 rounded-full" />
  ),
  success: () => (
    <div className="h-10 w-10 bg-alert-success bg-opacity-10 rounded-full" />
  ),
  warn: () => (
    <div className="h-10 w-10 bg-alert-pending bg-opacity-10 rounded-full" />
  ),
};

export default function useToast() {
  const addToast = useCallback(
    /**
     * @name addToast
     * @param {any} body
     * @param {Object} options
     * @param {("success"|"info"|"loading"|"warn"|"error")} options.type
     * @param {Number} options.hideAfter
     */
    (body, { type = "success", hideAfter = 6 }) => {
      const { hide } = cogoToast[type](
        <ToastBody body={body} onDismiss={() => hide()} />,
        {
          position: "bottom-right",
          bar: {
            size: "1px",
            style: "solid",
            color: "#f3f4f7",
          },
          hideAfter,
          renderIcon: TOAST_ICONS[type],
        }
      );
    },
    []
  );

  return addToast;
}

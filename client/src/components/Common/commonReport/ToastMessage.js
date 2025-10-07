import { toast } from "react-toastify";

const defaultOptions = {
  position: "top-left",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};


const showToast = (type, message, options = {}) => {
  const finalOptions = { ...defaultOptions, ...options };

  switch (type) {
    case "success":
      toast.success(message, finalOptions);
      break;
    case "error":
      toast.error(message, finalOptions);
      break;
    case "info":
      toast.info(message, finalOptions);
      break;
    case "warning":
      toast.warning(message, finalOptions);
      break;
    default:
      toast(message, finalOptions);
  }
};

export const showSuccessToast = (message, options = {}) =>
  showToast("success", message, options);

export const showErrorToast = (message, options = {}) =>
  showToast("error", message, options);

export const showInfoToast = (message, options = {}) =>
  showToast("info", message, options);

export const showWarningToast = (message, options = {}) =>
  showToast("warning", message, options);

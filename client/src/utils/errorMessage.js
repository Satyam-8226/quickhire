import toast from "react-hot-toast";

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  const serverMessage = error?.response?.data?.message || error?.response?.data?.error;

  return serverMessage || error?.message || fallback;
};

export const showErrorToast = (error, fallback = "Something went wrong") => {
  const message = getErrorMessage(error, fallback);
  toast.error(message);
  return message;
};

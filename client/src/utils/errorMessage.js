import toast from "react-hot-toast";

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (!error?.response && error?.message === "Network Error") {
    return "Unable to reach the server. Check your connection and try again.";
  }

  const status = error?.response?.status;

  if (status === 401) {
    return "Your session has expired. Please sign in again.";
  }

  if (status === 403) {
    return "You don't have permission to perform this action.";
  }

  if (status === 404) {
    return "The requested resource could not be found.";
  }

  if (status >= 500) {
    return "Our servers are having trouble. Please try again in a moment.";
  }

  const serverMessage =
    error?.response?.data?.message || error?.response?.data?.error;

  if (serverMessage && typeof serverMessage === "string") {
    return serverMessage;
  }

  return error?.message || fallback;
};

export const showErrorToast = (error, fallback = "Something went wrong") => {
  const message = getErrorMessage(error, fallback);
  toast.error(message);
  return message;
};

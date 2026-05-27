export const isEmail = (value) => {
  return /\S+@\S+\.\S+/.test(value);
};

export const isEmpty = (value) => {
  return !value || !value.toString().trim();
};
export const randomAmount = () => {
  return Math.random() * 100000;
};

export const randomPaymentId = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

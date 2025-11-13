export const generateToken = () => {
  const token = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
  return token;
};

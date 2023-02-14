export const getSecret = () => {
  const secret = process.env.SECRET;

  if (secret) return secret;
  throw new Error("Missing SECRET .env variable");
};

export const parseToken = token => {
  if (token) {
    return "Bearer " + token;
  }
  console.error("No token given");
  return;
};

export const createConfig = token => {
  return {
    headers: { Authorization: token }
  };
};
